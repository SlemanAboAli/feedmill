# -*- coding: utf-8 -*-
# controllers/recipe_api.py
import json
import re


from odoo import http
from odoo.http import request, Response

ALLOWED_ORIGINS = {"http://localhost:5173"}   # غيّرها إلى اسم نطاق واجهة React في الإنتاج


class FeedmillController(http.Controller):


# -----------------------------------------------------------------------------------


#----------------------------------------------------------------------------------
    @http.route(
        '/feedmill/create_uom_category',
        type='http',  # يمكن جعلها 'json' إن أردت
        auth='user',
        methods=['POST', 'OPTIONS'],
        csrf=False
    )
    def create_uom_category(self, **kw):
        # ردّ سريع على OPTIONS للسماح بـ CORS
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({}, 200)

        # 1) حمِّل الجسم
        data = json.loads(request.httprequest.data or '{}')
        name = (data.get('name') or '').strip()

        # 2) تحقق
        if not name:
            return self._cors_response(
                {'success': False, 'message': 'Name required'}, 400)

        # 3) ابحث إن كانت موجودة
        cat = request.env['uom.category'].sudo().search(
            [('name', '=ilike', name)], limit=1)

        if not cat:
            cat = request.env['uom.category'].sudo().create({'name': name})
            created = True
        else:
            created = False

        # 4) أعِد النتيجة
        return self._cors_response({
            'success': True,
            'id': cat.id,
            'created': created,  # False لو كانت موجودة مسبقًا
        })
#------------------------------------------------
    @http.route(
        '/feedmill/create_uom',
        type='http',
        auth='user',
        methods=['POST', 'OPTIONS'],  # ← أضفنا OPTIONS
        csrf=False
    )
    def create_uom(self, **kw):
        # 1) ردّ سريع على طلب OPTIONS (Pre‑flight)
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({}, 200)

        # 2) حمِّل جسم الطلب JSON (formData من React)
        data = json.loads(request.httprequest.data or '{}')

        name = data.get('name')
        category_id = int(data.get('category_id', 0))
        uom_type = data.get('uom_type', 'reference')

        try:
            ratio = float(data.get('ratio', 1))
            if ratio <= 0:
                raise ValueError("Ratio must be positive")
        except (ValueError, TypeError):
            return self._cors_response({'success': False, 'message': 'Invalid ratio value'}, 400)

        # 3) تحقق من البيانات
        if not name or not category_id:
            return self._cors_response(
                {'success': False, 'message': 'Missing fields'}, 400
            )

        cat = request.env['uom.category'].sudo().browse(category_id)
        if not cat.exists():
            return self._cors_response(
                {'success': False, 'message': 'Invalid category_id'}, 400
            )

        # 4) أنشئ وحدة القياس
        if uom_type == 'reference':
            factor = 1.0
            factor_inv = 1.0

        elif uom_type == 'bigger':  # الطن، الكرتونة، الخ…
            factor_inv = ratio  # 1 طن = 1000 كغ
            factor = 1.0 / ratio

        elif uom_type == 'smaller':  # الغرام، الميلي لتر…
            factor = ratio  # 1 كغ = 1000 غ
            factor_inv = 1.0 / ratio

        else:
            return self._cors_response(
                {'success': False, 'message': 'Invalid uom_type'}, 400
            )

        rounding = 1e-4 if min(factor, factor_inv) < 1 else 0.01

        uom = request.env['uom.uom'].sudo().create({
            'name': name,
            'category_id': category_id,
            'uom_type': uom_type,
            'factor': factor,
            'factor_inv': factor_inv,
            'rounding': rounding,
            'active': True,
        })

        # 5) أعد النتيجة
        return self._cors_response({'success': True, 'id': uom.id})

    # لجلب التصنيفات

    @http.route('/feedmill/uom_categories', type='http', auth='user', methods=['GET'], csrf=False)
    def get_uom_categories(self, **kwargs):
        categories = request.env['uom.category'].sudo().search([])
        data = [{'id': cat.id, 'name': cat.name} for cat in categories]
        return self._cors_response(json.dumps(data))

    # ------- 1) قائمة المنتجات لأزرار الاختيار في React ----------
    @http.route('/feedmill/product_list', type='http', auth='user', methods=['GET'], csrf=False)
    def product_list(self, **kw):
        products = request.env['product.product'].sudo().search([], limit=200)  # عدّل الفلتر كما تريد
        data = [
            {
                'id': p.id,
                'name': p.display_name,
                'uom_id': p.uom_id.id,
                'uom_name': p.uom_id.name,
                'unit_price': p.standard_price,
            } for p in products
        ]
        return self._cors_response(json.dumps(data))
#---------------------------
    # ------- 2) إنشاء وصفة علف كاملة بخطوطها ----------------------
    @http.route('/feedmill/create_recipe', type='http', auth='user',
                methods=['POST', 'OPTIONS'], csrf=False)
    def create_recipe(self, **kw):
        # ❶ استجابة الـ OPTIONS (Pre‑flight)
        if request.httprequest.method == 'OPTIONS':
            return self._cors_response({},200)
        # ❷ البيانات المرسَلة JSON
        #payload = request.jsonrequest  # {'name':…, 'code':…, 'notes':…, 'lines':[…]}
        payload=json.loads(request.httprequest.data or '{}')
        if not payload.get('name'):
            return self._cors_response({'error': 'Recipe name is required'}, 400)

        lines_vals = [
            (0, 0, {
                'product_id': l['product_id'],
                'quantity': float(l['quantity']),
                'uom_id': l.get('uom_id'),
                'unit_price': float(l.get('unit_price', 0)),
            }) for l in payload.get('lines', [])
        ]

        recipe_vals = {
            'name': payload.get('name'),
            'code': payload.get('code'),
            'notes': payload.get('notes'),
            'recipe_line_ids': lines_vals,
        }
        recipe = request.env['feed.recipe'].sudo().create(recipe_vals)
        return self._cors_response({'id': recipe.id, 'message': 'Recipe created'})

    # ------- أداة صغيرة لإضافة رؤوس CORS -------------------------
    # def _cors_response(self, data):
    #     headers = [
    #         ('Access-Control-Allow-Origin', ALLOWED_ORIGINS),
    #         ('Access-Control-Allow-Methods', 'GET,POST,OPTIONS'),
    #         ('Access-Control-Allow-Headers', 'Content-Type,Authorization'),
    #     ]
    #     return Response(
    #         headers=headers,
    #         data=http.serialize_exception(data) if isinstance(data, Exception) else data,
    #         content_type='application/json'
    #     )
    # أداة CORS المحدَّثة
    def _cors_response(self, data, status=200):
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
