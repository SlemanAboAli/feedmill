import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import api from "../api/axios";
//import axios from "axios";
import { Controller } from "react-hook-form";
import Select from "react-select";

import classes from "../styles/FeedRecipeFormPage.module.css";

/**
 * FeedRecipeFormPage.jsx — الإصدار 2
 * يدعم الآن الحقول uom_id و unit_price بحيث تُرسَل إلى Odoo مع كل خط مكوّن.
 * عند تغيير المنتج يُملأ uom_id و unit_price تلقائيًا، مع إمكانية تعديل السعر يدويًا.
 */
export default function FeedRecipeFormPage() {
  /* 🎛️ react-hook-form */
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      notes: "",
      lines: [
        {
          product_id: "",
          quantity: 1,
          uom_id: "",
          unit_price: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const watchedLines = watch("lines") || []; // لجلب التحديثات الفورية للأسطر

  /* 🛒 جلب قائمة المنتجات */
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api
      .get("/feedmill/product_list")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const findProduct = (id) => {
    const numId = Number(id);
    if (Number.isNaN(numId)) return undefined;
    return products.find((p) => p.id === numId);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        lines: data.lines.map((l) => ({
          ...l,
          product_id: Number(l.product_id),
          quantity: Number(l.quantity),
          uom_id: Number(l.uom_id),
          unit_price: Number(l.unit_price),
        })),
      };

      await api.post("/feedmill/create_recipe", payload);
      alert("Recipe saved!");
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Error creating recipe";
      alert("Error: " + msg);
    }
  };

  /* 🖼️ واجهة المستخدم */
  return (
    <div className={classes.formContainer}>
      <h2>Create Feed Recipe</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ——— رأس الوصفة ——— */}
        <div className={classes.grid2Cols}>
          <label>
            Recipe Name
            <input {...register("name", { required: true })} />
            {errors.name && <span className={classes.error}>Required</span>}
          </label>
          <label>
            Code
            <input {...register("code")} />
          </label>
        </div>
        <label>
          Notes
          <textarea rows={2} {...register("notes")} />
        </label>
        {/* ——— جدول المكونات ——— */}
        <table className={classes.linesTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Qty</th>
              <th>UoM</th>
              <th>Unit Price</th>
              <th>Line Cost</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              const qty = watch(`lines.${index}.quantity`) || 0;
              const unitPrice = watch(`lines.${index}.unit_price`) || 0;
              const prodId = watch(`lines.${index}.product_id`);
              const prod = findProduct(prodId);
              const uomName = prod?.uom_name || "";
              const lineCost = qty * unitPrice;

              return (
                <tr key={field.id}>
                  <td className={classes.colIndex}>{index + 1}</td>

                  {/* اختيار المنتج */}
                  <td className={classes.colProduct}>
                    <Controller
                      name={`lines.${index}.product_id`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => {
                        // إيجاد المنتج الذي له نفس الـ id المختار حاليًا
                        const selectedProduct = products.find(
                          (p) => p.id === field.value
                        );

                        return (
                          <Select
                            value={
                              selectedProduct
                                ? {
                                    value: selectedProduct.id,
                                    label: selectedProduct.name,
                                  }
                                : null
                            }
                            onChange={(selectedOption) => {
                              const val = selectedOption?.value || "";
                              field.onChange(val);

                              const p = findProduct(val);
                              if (p) {
                                setValue(`lines.${index}.uom_id`, p.uom_id);
                                setValue(
                                  `lines.${index}.unit_price`,
                                  p.unit_price
                                );
                              } else {
                                setValue(`lines.${index}.uom_id`, "");
                                setValue(`lines.${index}.unit_price`, "");
                              }
                            }}
                            options={products.map((p) => ({
                              value: p.id,
                              label: p.name,
                            }))}
                            placeholder="-- choose product --"
                            isClearable
                          />
                        );
                      }}
                    />

                    {/* uom_id مخفي لكن يُرسل */}
                    <input
                      type="hidden"
                      {...register(`lines.${index}.uom_id`)}
                    />
                  </td>

                  {/* الكمية */}
                  <td className={classes.colQty}>
                    <input
                      type="number"
                      step="any"
                      {...register(`lines.${index}.quantity`, {
                        required: true,
                        min: 0,
                      })}
                    />
                  </td>

                  {/* اسم الوحدة */}
                  <td className={classes.colUom}>{uomName}</td>

                  {/* السعر للوحدة */}
                  <td className={classes.colPrice}>
                    <input
                      type="number"
                      step="0.0001"
                      {...register(`lines.${index}.unit_price`, {
                        required: true,
                        min: 0,
                      })}
                    />
                  </td >

                  {/* تكلفة السطر */}
                  <td className={classes.colLineCost}>{lineCost.toFixed(2)}</td>

                  {/* حذف السطر */}
                  <td className={classes.colDelete}>
                    <button type="button" onClick={() => remove(index)}>
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* زر إضافة مكوّن */}
        <button
          type="button"
          className={classes.addLineBtn}
          onClick={() =>
            append({ product_id: "", quantity: 1, uom_id: "", unit_price: "" })
          }
        >
          + Add ingredient
        </button>
        {/* ——— ملخّص التكلفة ——— */}

        
        <div className={classes.summaryBox}>
          <div>
            <strong>Total Quantity:</strong>{" "}
            {watchedLines
              .reduce((sum, line) => sum + Number(line.quantity || 0), 0)
              .toFixed(2)}
          </div>
          <div>
            <strong>Total Cost:</strong>{" "}
            {watchedLines
              .reduce(
                (sum, line) =>
                  sum +
                  Number(line.quantity || 0) * Number(line.unit_price || 0),
                0
              )
              .toFixed(2)}
          </div>
          <div>
            <strong>Cost per Kg:</strong>{" "}
            {(() => {
              const totalQty = watchedLines.reduce(
                (sum, line) => sum + Number(line.quantity || 0),
                0
              );
              const totalCost = watchedLines.reduce(
                (sum, line) =>
                  sum +
                  Number(line.quantity || 0) * Number(line.unit_price || 0),
                0
              );
              return totalQty ? (totalCost / totalQty).toFixed(2) : "0.00";
            })()}
          </div>
        </div>
        {/* زر الحفظ */}
        <button type="submit" className={classes.submitBtn}>
          Save Recipe
        </button>
      </form>
    </div>
  );
}
