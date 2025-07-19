from odoo import http
from odoo.http import Response
import json

def cors_response(data, status=200):
    headers = [
        ('Content-Type', 'application/json'),
        ('Access-Control-Allow-Origin', 'http://localhost:5173'),
        ('Access-Control-Allow-Credentials', 'true'),
        ('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization'),
    ]
    return Response(json.dumps(data), status=status, headers=headers)

class CORSController(http.Controller):

    @http.route(['/web/session/authenticate'], type='json', auth="none", csrf=False, methods=["OPTIONS"])
    def options_auth(self, **kwargs):
        return cors_response({})
