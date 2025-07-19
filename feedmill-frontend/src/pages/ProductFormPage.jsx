//   src/pages/ProductFormPage.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../api/axios";
import classes from "../styles/ProductFormPage.module.css";
import CreateUoMForm from "./CreateUoMForm";

export default function ProductFormPage() {
  const [uomFormIsOpen, setUomFormIsOpen] = useState(false); // لاستدعاء صفحة إضافة الواحدة
  const [formData, setFormData] = useState({
    name: "",
    standard_price: "",
    list_price: "",
    uom_id: "",
  });
  const [uomOptions, setUomOptions] = useState([]);
  const uomOptionsRS = uomOptions.map((u) => ({ value: u.id, label: u.name }));
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'

  useEffect(() => {
    api
      .get("/feedmill/uom_list", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => setUomOptions(res.data))
      .catch((err) => console.error("Error loading UOMs:", err));
  }, []);
   // load page CreateUomForm
  function HandleCreateUomForm() {
    setUomFormIsOpen(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log(`Change: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحويل القيم إلى الأنواع الصحيحة
    const payload = {
      name: formData.name.trim(),
      uom_id: Number(formData.uom_id),
      standard_price: Number(formData.standard_price),
      list_price: Number(formData.list_price),
    };

    console.log("🚀 Sending payload:", JSON.stringify(payload, null, 2));

    try {
      if (!formData.name.trim()) {
        setMessage("Please enter a product name.");
        setMessageType("error");
        return;
      }

      //const response = await api.post("/feedmill/create_product", payload);
      //console.log("Response from create_product:", response.data);

      await api.post("/feedmill/create_product", payload);
      setMessage("Product created successfully!");
      setMessageType("success");
      setFormData({ name: "", standard_price: "", list_price: "", uom_id: "" });
    } catch (error) {
      console.error("Error creating product:", error);
      setMessage("Failed to create product.");
      setMessageType("error");
    }
  };

  return (
    <div className={classes.formcontainer}>
      <button onClick={HandleCreateUomForm}>Add UOM </button>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes.formgroup}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.formgroup}>
          <label>Cost (Standard Price):</label>
          <input
            type="number"
            step="1"
            name="standard_price"
            value={formData.standard_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.formgroup}>
          <label>Sale Price (List Price):</label>
          <input
            type="number"
            step="1"
            name="list_price"
            value={formData.list_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className={classes.formgroup}>
          <label>Unit of Measure:</label>
          <Select
            options={uomOptionsRS}
            value={
              uomOptionsRS.find((o) => o.value === formData.uom_id) || null
            }
            onChange={(option) =>
              setFormData((prev) => ({ ...prev, uom_id: option?.value || "" }))
            }
            placeholder="Select or search UoM..."
            isClearable
          />
        </div>
        <button type="submit" className={classes.buttonsubmit}>
          Create Product
        </button>
      </form>
      {message && (
        <p className={`${classes.message} ${classes[messageType]}`}>
          {message}
        </p>
      )}

      {uomFormIsOpen && <CreateUoMForm />}
    </div>
  );
}
