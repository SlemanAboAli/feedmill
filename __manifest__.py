{
    'name': 'FEED MILL Management',
    'version': '1.0',
    'summary': 'Manage feed recipes and production',
    'description': 'Module for managing animal feed recipes and production operations',
    'category': 'Manufacturing',
    'author': 'Suleiman',
    'depends': ['base', 'stock', 'product'],
    'data': [
        'security/ir.model.access.csv',
        'views/feed_recipe_view.xml',
    ],
    'assets': {},
    'web.assets_backend': [],
    # ↓↓↓ أضفنا Controllers (ليحمّلها Odoo)
    'api_access': True,

    'installable': True,
    'application': True,
    'auto_install': False,
}
