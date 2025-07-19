// src/pages/CreateUoMForm.jsx
import React, { useEffect, useState } from "react";
//import axios from "axios";
import api from "../api/axios";
import classes from "../styles/CreateUoMForm.module.css";

export default function CreateUoMForm() {
  const [customCat, setCustomCat] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    uom_type: "reference",
    ratio: "1",
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    api
      .get("/feedmill/uom_categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoryId = formData.category_id;
    try {
      // 1) لو اختار المستخدم "NEW" أنشئ الفئة أولًا
      if (categoryId === "NEW") {
        const resCat = await api.post("/feedmill/create_uom_category", {
          name: customCat,
        });
        if (!resCat.data.success) throw new Error(resCat.data.message);
        categoryId = resCat.data.id; // ID الجديد/الحالى
      }

      // 2) أرسل إنشاء الـ UoM
      const payload = { ...formData, category_id: categoryId };
      //delete payload.category_name; // ليس ضروريًا الآن
      const res = await api.post("/feedmill/create_uom", payload);

      if (res.data.success) {
        setMessage("Unit of Measure created successfully.");
        setMessageType("success");
        setFormData({
          name: "",
          category_id: "",
          uom_type: "reference",
          ratio: "1",
        });
        setCustomCat("");
        // أعدّ تحميل قائمة الفئات إن شئت
        const cats = await api.get("/feedmill/uom_categories");
        setCategories(cats.data);
      } else {
        throw new Error(res.data.message || "Creation failed.");
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      const niceMsg = apiMsg?.includes("reference unit")
        ? "هناك بالفعل وحدة مرجعية فى هذه الفئة. اختر نوع Bigger/Smaller أو فئة جديدة."
        : apiMsg || "خطأ غير متوقّع";

      setMessage(niceMsg);
      setMessageType("error");
    }
  };

  return (
    <div className={classes.formContainer}>
      <h2>Create Unit of Measure</h2>

      <form onSubmit={handleSubmit}>
        <div className={classes.formGroup}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={classes.formGroup}>
          <label>Category:</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="NEW">+ New Category…</option>
          </select>
        </div>

        <div className={classes.formGroup}>
          <label>UoM Type:</label>
          <select
            name="uom_type"
            value={formData.uom_type}
            onChange={handleChange}
          >
            <option value="reference">Reference</option>
            <option value="bigger">Bigger</option>
            <option value="smaller">Smaller</option>
          </select>
        </div>
        {formData.category_id === "NEW" && (
          <div className={classes.formGroup}>
            <label>New Category Name:</label>
            <input
              type="text"
              value={customCat}
              onChange={(e) => setCustomCat(e.target.value)}
              required
            />
          </div>
        )}

        <div className={classes.formGroup}>
          <label>Ratio:</label>
          <input
            type="number"
            name="ratio"
            step="any" 
            value={formData.ratio}
            onChange={handleChange}
            
          />
        </div>

        <button type="submit" className={classes.submitButton}>
          Create
        </button>
      </form>
      {message && (
        <p className={`${classes.message} ${classes[messageType]}`}>
          {message}
        </p>
      )}
    </div>
  );
}
