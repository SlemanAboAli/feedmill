#feed_recipe_line
from odoo import models, fields, api

class FeedRecipeLine(models.Model):
    _name = 'feed.recipe.line'
    _description = 'Feed Recipe Line'

    recipe_id = fields.Many2one('feed.recipe', string="Recipe", required=True, ondelete='cascade')
    product_id = fields.Many2one('product.product', string="Ingredient", required=True)
    quantity = fields.Float(string="Quantity", required=True)
    uom_id = fields.Many2one('uom.uom', string="Unit of Measure", readonly=True)
    unit_price = fields.Float(string="Unit Price", readonly=True)
    line_cost = fields.Float(string="Line Cost", compute="_compute_line_cost", store=True)
    notes = fields.Char(string="Notes")

    @api.onchange('product_id')
    def _onchange_product_id(self):
        for line in self:
            if line.product_id:
                line.uom_id = line.product_id.uom_id.id
                line.unit_price = line.product_id.standard_price

    @api.depends('quantity', 'unit_price')
    def _compute_line_cost(self):
        for line in self:
            line.line_cost = line.quantity * line.unit_price
