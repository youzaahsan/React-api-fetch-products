import React, { useEffect, useState } from "react";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch API Data
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
      setLoading(false);
    } else {
      fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          localStorage.setItem("products", JSON.stringify(data));
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products]);

  // Add Product
  const addProduct = () => {
    if (text.trim() === "") {
      alert("Please enter product title");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: text,
      price: 0,
      image: "https://via.placeholder.com/300",
    };

    setProducts([newProduct, ...products]);
    setText("");
  };

  // Edit Product
  const editProduct = (index) => {
    const updatedTitle = prompt(
      "Edit Product",
      products[index].title
    );

    if (updatedTitle !== null) {
      const updatedProducts = products.map((item, i) =>
        i === index
          ? { ...item, title: updatedTitle }
          : item
      );

      setProducts(updatedProducts);
    }
  };

  // Delete Product
  const deleteProduct = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (confirmDelete) {
      setProducts(products.filter((item, i) => i !== index));
    }
  };

  // Search Filter
  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fw-bold text-primary">
        Product Management App
      </h1>

      {/* Add Product */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Product Name"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <button
            className="btn btn-primary w-100"
            onClick={addProduct}
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center mt-5">
          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <h4 className="mt-3">Loading Products...</h4>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div
                key={item.id}
                className="col-lg-4 col-md-6 mb-4"
              >
                <div className="card h-100 shadow border-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top p-3"
                    style={{
                      height: "250px",
                      objectFit: "contain",
                    }}
                  />

                  <div className="card-body">
                    <h5>{item.title}</h5>

                    <h4 className="text-success">
                      ${item.price}
                    </h4>
                  </div>

                  <div className="card-footer bg-white border-0 d-flex justify-content-between">
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        editProduct(index)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteProduct(index)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3 className="text-center">
              No Products Found
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

export default Index;