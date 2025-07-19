# -*- coding: utf-8 -*-
#product_api.py
import json
import logging
import re

_logger = logging.getLogger(__name__)

from odoo import http
from odoo.http import request, Response

ALLOWED_ORIGINS = {"http://localhost:5173"}    # غيّر للدومين الفعلي للـ React

class ProductApi(http.Controller):

    # 1) قائمة وحدات القياس لملء Dropdown
    @http.route("/feedmill/uom_list", type="http", auth="user", methods=["GET"], csrf=False)
    def uom_list(self, **kw):
        uoms = request.env["uom.uom"].sudo().search([])
        data = [{"id": u.id, "name": u.name} for u in uoms]
        return self._cors(json.dumps(data))

# =============== دالة إضافة منتج ======================
    @http.route(
        '/feedmill/create_product',
        type='http',  # ← HTTP بدل JSON
        auth='user',
        methods=['POST', 'OPTIONS'],
        csrf=False
    )
    def create_product(self, **kw):
        # ✔️ ردّ سريع على Pre‑flight

        if request.httprequest.method == 'OPTIONS':
            return self._cors({}, 200)

        # ✔️ بيانات JSON المرسَلة من React
        # data = request.jsonrequest or {}  # dict
        # 2) حمِّل جسم الطلب JSON (formData من React)
        data = json.loads(request.httprequest.data or '{}')
        _logger.info("📦 Payload: %s", data)

        # --- تحقق من البيانات ---
        name = (data.get('name') or '').strip()
        if not name:
            return self._cors(
                {'success': False, 'error': 'Product name is required'}, 400)

        try:
            uom_id = int(data.get('uom_id'))
        except (TypeError, ValueError):
            return self._cors(
                {'success': False, 'error': 'Valid uom_id is required'}, 400)

        def to_float(val, field):
            try:
                return float(val or 0.0)
            except (TypeError, ValueError):
                raise ValueError(f'{field} must be numeric')

        try:
            standard_price = to_float(data.get('standard_price'), 'standard_price')
            list_price = to_float(data.get('list_price'), 'list_price')
        except ValueError as err:
            return self._cors({'success': False, 'error': str(err)}, 400)

        # --- إنشاء المنتج عبر product.template ---
        vals = {
            'name': name,
            'uom_id': uom_id,
            'uom_po_id': uom_id,
            'standard_price': standard_price,
            'list_price': list_price,
            'type': 'product',
            'sale_ok': True,
            'purchase_ok': True,
            'categ_id': request.env.ref('product.product_category_all').id,
            'company_id': request.env.company.id,
            'active': True,
        }

        template = request.env['product.template'].sudo().create(vals)
        _logger.info("✅ Created template %s (%s)", template.id, template.name)

        # --- الرد ---
        return self._cors({
            'success': True,
            'template_id': template.id,
            'message': 'Product created successfully'
        })

    #=========================================

    # ——— أداة تكرارية لإضافة رؤوس CORS ———
    def _cors(self, data, status=200):
        if not isinstance(data, (str, bytes)):
            data = json.dumps(data)

            # أصل الطلب كما يرسله المتصفّح
        origin = request.httprequest.headers.get('Origin', '')
        # إن وُجد شرطة مائلة أخيرة أزلها
        origin = re.sub(r'/$', '', origin)

        # اسمح فقط بالأصول المعرّفة لديك
        if origin not in ALLOWED_ORIGINS:
            origin = "null"  # أو أعد خطأ 403 حسب رغبتك

        headers = [
            ('Access-Control-Allow-Origin', origin),
            ('Access-Control-Allow-Credentials', 'true'),
            ('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type,Authorization'),
            ('Content-Type', 'application/json'),
        ]
        return Response(data, status=status, headers=headers)

