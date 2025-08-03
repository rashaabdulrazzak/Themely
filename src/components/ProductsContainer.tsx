import React, { useState, useEffect } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProductService } from "../services/ProductService";
import { Rating } from "primereact/rating";
import "./DataViewDemo.css";
import { Tag } from "primereact/tag";
import { Carousel } from "primereact/carousel";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Badge } from "primereact/badge";
const ProductsContainer = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any>([]);
  const [layout, setLayout] = useState("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const sortOptions = [
    { label: "Price High to Low", value: "!price" },
    { label: "Price Low to High", value: "price" },
  ];

  useEffect(() => {
    ProductService.getProducts().then((data) => {
      setProducts(data);
      console.log(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /*const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };*/

  const getSeverity = (product: any) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const renderListItem = (data: any) => {
    return (
      <div className="col-12">
        <div className="product-list-item">
          <img
            src={`${data.image[0]}`}
            /*onError={(e) =>
              (e.target.src =
                "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
            }*/
            alt={data.title}
          />
          <div className="product-list-detail">
            <div className="product-name">{data.title}</div>
            <div className="product-description">{data.description}</div>
            <Rating value={data.rating} readOnly cancel={false}></Rating>
            <i className="pi pi-tag product-category-icon"></i>
            <span className="product-category">{data.category}</span>
          </div>
          <div className="product-list-action">
            <span className="product-price">${data.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              disabled={data.inventoryStatus === "OUTOFSTOCK"}
            ></Button>
            <span
              className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}
            >
              {data.inventoryStatus}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderGridItem1 = (data: any) => {
    return (
      <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={data.id}>
        <div className="p-4 border-1 surface-border surface-card border-round">
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-tag"></i>
              <span className="font-semibold">{data.category}</span>
            </div>
            <Tag
              value={data.inventoryStatus}
              severity={getSeverity(data)}
            ></Tag>
          </div>
          <div className="flex flex-column align-items-center gap-3 py-5">
            <img
              className="w-9 shadow-2 border-round"
              src={`https://primefaces.org/cdn/primereact/images/product/${data.image}`}
              alt={data.name}
            />
            <div className="text-2xl font-bold">{data.name}</div>
            <Rating value={data.rating} readOnly cancel={false}></Rating>
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-2xl font-semibold">${data.price}</span>
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-rounded"
              disabled={data.inventoryStatus === "OUTOFSTOCK"}
            ></Button>
          </div>
        </div>
      </div>
    );
  };
  const productTemplate = (image: any) => {
    return (
      <div className="relative overflow-hidden pb-60">
        <img
          className="absolute h-full w-full object-cover object-center"
          src={`${image}`}
          alt=""
        />
      </div>
    );
  };

  const renderGridItem = (data: any) => {
    return (
      <>
        <div className="bg-white rounded border border-gray-300 m-2">
          <div className="relative w-full  mb-2">
            <div className="product-grid-item-content">
              {data.images?.length > 1 ? (
                <Carousel
                  value={data.images}
                  numScroll={1}
                  numVisible={1}
                  itemTemplate={productTemplate}
                />
              ) : (
                <div className="relative overflow-hidden pb-60">
                  <img
                    className="absolute h-full w-full object-cover object-center"
                    src={`${data.images[0]}`}
                    alt={data.title}
                  />
                </div>
              )}
            </div>
            <span className="absolute top-0 left-0 px-2 py-1 mt-2 mr-2 rounded shadow-sm text-xs bg-yellow-100 border-0 border-gray-600">
              <AvatarGroup>
                <Avatar
                  image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                  shape="circle"
                />
                <Avatar
                  image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
                  shape="circle"
                />
              </AvatarGroup>
            </span>
          </div>
          <div className="flex items-center justify-between mb-4 mx-4">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-300">
                {data.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2 mx-4">
            <h2 className="text-xs font-medium dark:text-gray-700">
              by{" "}
              <span className="text-xs font-medium text-purple-600	">
                {data.supplier}{" "}
              </span>
            </h2>
            <span className="inline-block px-2 py-1 text-xs text-blue-500 rounded-full dark:bg-gray-700 dark:text-blue-400 bg-blue-50">
              Country
            </span>
          </div>
          <div className="flex items-center justify-between mb-2 mx-4">
            <div>
              <h2 className="text-xs font-medium dark:text-gray-300">
                Listing cost
              </h2>
              <span className="inline-block px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                {data.base_price}
              </span>
            </div>
            <div>
              <h2 className="text-xs font-medium dark:text-gray-300">
                Retail Price
              </h2>
              <span className="inline-block px-2 py-1 text-xs text-blue-500 ">
                {data.base_price}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 mx-4">
            <div className="flex items-center">
              <img
                src="https://i.postimg.cc/s2tvtrPF/first.jpg"
                alt=""
                className="object-cover object-right rounded-full w-7 h-7"
              />
              <img
                src="https://i.postimg.cc/RF9h9qzx/pexels-jaime-reimer-2695232.jpg"
                alt=""
                className="object-cover object-right -ml-2 rounded-full w-7 h-7"
              />
              <img
                src="https://i.postimg.cc/fW3hVdhv/pexels-rodnae-productions-7648047.jpg"
                alt=""
                className="object-cover object-right -ml-2 rounded-full w-7 h-7"
              />
              <a href="" className="text-gray-700 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                </svg>
              </a>
            </div>
            <a
              href="#"
              className="px-3 py-2 text-xs text-white bg-blue-800 rounded hover:bg-blue-600"
            >
              See Details
            </a>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="product-grid-item card">
            <div className="product-grid-item-content relative">
              {data.images?.length > 1 ? (
                <Carousel
                  value={data.images}
                  numScroll={1}
                  numVisible={1}
                  itemTemplate={productTemplate}
                />
              ) : (
                <img src={`${data.images[0]}`} alt={data.title} />
              )}
              <span className="absolute top-0 left-0 px-2 py-1 mt-2 mr-2 rounded shadow-sm text-xs bg-yellow-100 border-0 border-gray-600">
                <AvatarGroup>
                  <Avatar
                    image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                    shape="circle"
                  />
                  <Avatar
                    image="https://primefaces.org/cdn/primereact/images/avatar/asiyajavayant.png"
                    shape="circle"
                  />
                </AvatarGroup>
              </span>
            </div>
            <div className="product-name">{data.title}</div>
            <div className="product-description">{data.description}</div>
            <div className="product-grid-item-bottom">
              <span className="product-price">${data.base_price}</span>
              <Button
                icon="pi pi-shopping-cart"
                label="Add to Cart"
                disabled={data.quantity === 0}
              ></Button>
            </div>
          </div>
        </div>
      </>
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemTemplate = (product: any, layout: any) => {
    if (!product) {
      return;
    }

    if (layout === "list") return renderListItem(product);
    else if (layout === "grid") return renderGridItem(product);
  };

  const renderHeader = () => {
    return (
      <div className="grid grid-nogutter">
        <div className="col-6" style={{ textAlign: "left" }}>
          <Dropdown
            options={sortOptions}
            value={sortKey}
            optionLabel="label"
            placeholder="Sort By Price"
            //onChange={onSortChange}
          />
        </div>
        <div className="col-6" style={{ textAlign: "right" }}>
          <DataViewLayoutOptions
            layout={"grid"}
            onChange={(e) => setLayout(e.value)}
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();
  const listTemplate = (products: any, layout: string) => {
    return (
      <div className="grid grid-nogutter">
        {products.map((product: any, index: number) =>
          itemTemplate(product, layout)
        )}
      </div>
    );
  };
  return (
    <div className="dataview-demo">
      <div className="card">
        <DataView
          value={products}
          layout={"grid"}
          header={header}
          itemTemplate={itemTemplate}

          // paginator
          // rows={9}
          // sortOrder={sortOrder}
          //sortField={sortField}
        />
      </div>
    </div>
  );
};
export default ProductsContainer;
