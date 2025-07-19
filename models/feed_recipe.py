# feed_recipe.py
from odoo import models, fields, api, _

class FeedRecipe(models.Model):
    _name = 'feed.recipe'
    _description = 'Feed Recipe'

    name = fields.Char(string="Recipe Name", required=True)
    code = fields.Char(string="Reference Code")
    notes = fields.Text(string="Notes")
    recipe_line_ids = fields.One2many('feed.recipe.line', 'recipe_id', string="Ingredients")
    total_cost = fields.Float(string="Total Cost", compute="_compute_total_cost", store=True)

    @api.depends('recipe_line_ids.line_cost')
    def _compute_total_cost(self):
        for rec in self:
            rec.total_cost = sum(line.line_cost for line in rec.recipe_line_ids)

    total_quantity = fields.Float(string="Total Quantity (kg)", compute="_compute_totals", store=True)
    cost_per_kg = fields.Float(string="Cost per Kg", compute="_compute_totals", store=True)

    @api.depends('recipe_line_ids.quantity', 'recipe_line_ids.line_cost')
    def _compute_totals(self):
        for rec in self:
            total_qty = sum(line.quantity for line in rec.recipe_line_ids)
            total_cost = sum(line.line_cost for line in rec.recipe_line_ids)

            rec.total_quantity = total_qty
            rec.cost_per_kg = (total_cost / total_qty) if total_qty else 0.0


