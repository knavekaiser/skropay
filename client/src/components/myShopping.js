import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
  lazy,
} from "react";
import {
  Succ_svg,
  Err_svg,
  Plus_svg,
  X_svg,
  Combobox,
  Pagination,
  Checkbox,
  calculateDiscount,
  calculatePrice,
  Actions,
  Chev_down_svg,
  Tabs,
  Arrow_left_svg,
  Media,
  User,
  FileInput,
  UploadFiles,
  Img,
  Moment,
  moment,
  InputDateRange,
} from "./Elements";
import { Link, Route, useHistory, Switch, Redirect } from "react-router-dom";
import { SiteContext } from "../SiteContext";
import { Modal, Confirm } from "./Modal";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
const MilestoneForm = lazy(() =>
  import("./Forms").then((mod) => ({ default: mod.MilestoneForm }))
);

export const Orders = ({ status, onClick }) => {
  const { cart, userType } = useContext(SiteContext);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [sort, setSort] = useState({
    column: "createdAt",
    order: "dsc",
  });
  const [orders, setOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [batch, setBatch] = useState([]);
  const [msg, setMsg] = useState(null);
  const [carts, setCarts] = useState([]);
  useEffect(() => {
    const startDate = moment({
      time: dateRange?.startDate,
      format: "YYYY-MM-DD",
    });
    const endDate = moment({
      time: new Date(dateRange?.endDate)?.setHours(24, 0, 0, 0),
      format: "YYYY-MM-DD",
    });
    fetch(
      `/api/getOrders?${new URLSearchParams({
        user: "buyer",
        ...(search && { q: search }),
        page,
        perPage,
        sort: sort.column,
        order: sort.order,
        ...(dateRange && {
          dateFrom: startDate,
          dateTo: endDate,
        }),
        ...(type && { type }),
        ...(status && { status }),
      })}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setOrders(data.orders);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get orders.</h4>
            </div>
          </>
        );
      });
  }, [type, search, page, perPage, dateRange, status]);
  useEffect(() => {
    fetch("/api/getCartDetail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setCarts(data.carts);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get cart detail. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, [cart]);
  useEffect(() => {
    if (selectAll) {
    } else {
      setBatch([]);
    }
  }, [selectAll]);
  useEffect(() => {
    if (batch.length === 0) {
      setSelectAll(false);
    }
  }, [batch]);
  return (
    <>
      {userType === "seller" && <Redirect to="/account/myShop/orders" />}
      <div className="productContainer">
        {
          <div className="benner">
            <p>My Orders</p>
          </div>
        }
        {
          //   <div className="filters">
          //   <section>
          //     <label>Total:</label>
          //     {total}
          //   </section>
          //   <section>
          //     <label>Per Page:</label>
          //     <Combobox
          //       defaultValue={0}
          //       options={[
          //         { label: "20", value: 20 },
          //         { label: "30", value: 30 },
          //         { label: "50", value: 50 },
          //       ]}
          //       onChange={(e) => setPerPage(e.value)}
          //     />
          //   </section>
          //   <section className="search">
          //     <svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       width="23"
          //       height="23"
          //       viewBox="0 0 23 23"
          //     >
          //       <path
          //         id="Icon_ionic-ios-search"
          //         data-name="Icon ionic-ios-search"
          //         d="M27.23,25.828l-6.4-6.455a9.116,9.116,0,1,0-1.384,1.4L25.8,27.188a.985.985,0,0,0,1.39.036A.99.99,0,0,0,27.23,25.828ZM13.67,20.852a7.2,7.2,0,1,1,5.091-2.108A7.155,7.155,0,0,1,13.67,20.852Z"
          //         transform="translate(-4.5 -4.493)"
          //         fill="#707070"
          //         opacity="0.74"
          //       />
          //     </svg>
          //     <input
          //       value={search}
          //       onChange={(e) => setSearch(e.target.value)}
          //       placeholder="Search for Seller"
          //     />
          //     {search && (
          //       <button onClick={() => setSearch("")}>
          //         <X_svg />
          //       </button>
          //     )}
          //   </section>
          //   <section className="category">
          //     <label>Type:</label>
          //     <Combobox
          //       defaultValue={0}
          //       options={[
          //         { label: "All", value: "" },
          //         { label: "Product", value: "product" },
          //         { label: "Service", value: "service" },
          //         { label: "Other", value: "other" },
          //       ]}
          //       onChange={(e) => setType(e.value)}
          //     />
          //   </section>
          // <section className={`date`}>
          //   <InputDateRange
          //     dateRange={dateRange}
          //     onChange={(range) => setDateRange(range)}
          //   />
          // </section>
          // </div>
        }
        {batch.length > 0 && (
          <div className="batchAction">
            <button onClick={() => console.log("batch delete")}>Delete</button>
          </div>
        )}
        <table className="table orders">
          <thead>
            <tr>
              {
                //   <th className="checkContainer">
                //   <Checkbox
                //     value={selectAll}
                //     defaultValue={selectAll}
                //     onChange={(e) => setSelectAll(e)}
                //   />
                // </th>
              }
              <th>Order</th>
              <th className="date">Purchase Date</th>
              {
                //   <th>Seller</th>
                // <th>QTY</th>
                // <th>Refundable</th>
                // <th>Milestone</th>
              }
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <SingleOrder
                onClick={onClick}
                key={order._id}
                order={order}
                setOrders={setOrders}
                selectAll={selectAll}
                setBatch={setBatch}
                batch={batch}
              />
            ))}
            {status?.includes("pending") &&
              carts.map((order) => (
                <OrderDraft order={order} key={order.seller._id} />
              ))}
            {orders.length === 0 && (
              <tr className="placeholder">
                <td>No order yet.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          total={total}
          btns={5}
          currentPage={page}
          perPage={perPage}
          setPage={setPage}
        />
        <Modal className="msg" open={msg}>
          {msg}
        </Modal>
      </div>
    </>
  );
};
const OrderDraft = ({ order, setOrder }) => {
  const actionsRef = useRef();
  const checkRef = useRef();
  const history = useHistory();
  const total = +(
    order.products.reduce(
      (a, c) =>
        (
          a +
          calculatePrice({ product: c.product, gst: order.seller.gst }) * c.qty
        ).fix(),
      0
    ) + (order.seller.shopInfo?.shippingCost || 0)
  ).fix();
  return (
    <tr
      className="order"
      onClick={(e) => {
        if (
          e.nativeEvent.path.includes(actionsRef.current) ||
          e.nativeEvent.path.includes(checkRef.current)
        ) {
        } else {
          history.push("/account/cart");
        }
      }}
    >
      <td>-</td>
      <td className="date">
        <Moment format="DD MMM YYYY">{new Date()}</Moment>
      </td>
      <td>₹{total}</td>
      <td>Draft</td>
      <td ref={actionsRef}>
        <Actions icon={<Chev_down_svg />}>
          <Link to="/account/cart">View Detail</Link>
        </Actions>
      </td>
    </tr>
  );
};
const SingleOrder = ({
  order,
  setOrders,
  selectAll,
  setBatch,
  batch,
  onClick,
}) => {
  const actionsRef = useRef();
  const checkRef = useRef();
  const history = useHistory();
  const { user } = useContext(SiteContext);
  const [selected, setSelected] = useState(selectAll || false);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState(false);
  const cancelOrder = () => {
    fetch("/api/cancelOrder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: order._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setOrders((prev) =>
            prev.map((item) => {
              if (item._id === order._id) {
                return {
                  ...item,
                  status: data.order?.status,
                };
              } else {
                return item;
              }
            })
          );
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not cancel order. Please try again.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not cancel order. Make sure you're online</h4>
            </div>
          </>
        );
      });
  };
  const requestCancellation = () => {
    fetch("/api/requestCancellation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: order._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setOrders((prev) =>
            prev.map((item) => {
              if (item._id === order._id) {
                return {
                  ...item,
                  status: data.order?.status,
                };
              } else {
                return item;
              }
            })
          );
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Could not cancel order. Please try again.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not cancel order. Make sure you're online</h4>
            </div>
          </>
        );
      });
  };
  useEffect(() => {
    setSelected(selectAll);
  }, [selectAll]);
  useEffect(() => {
    if (selected) {
      setBatch((prev) => [...prev, order._id]);
    } else {
      setBatch((prev) => prev.filter((item) => item !== order._id));
    }
  }, [selected]);
  return (
    <>
      <tr
        className={`order ${selected ? "selected" : ""}`}
        onClick={(e) => {
          if (
            e.nativeEvent.path.includes(actionsRef.current) ||
            e.nativeEvent.path.includes(checkRef.current) ||
            batch.length > 0
          ) {
          } else {
            onClick?.(order._id);
          }
        }}
      >
        {
          //   <td className="checkContainer" ref={checkRef}>
          //   <Checkbox
          //     defaultValue={selected}
          //     value={selected}
          //     onChange={(e) => {
          //       setSelected(e);
          //     }}
          //   />
          // </td>
        }
        <td>{order._id}</td>
        <td className="date">
          <Moment format="DD MMM YYYY">{order.createdAt}</Moment>
        </td>
        {
          //   <td>
          //   <User user={order.seller} />
          // </td>
          // <td>{order.products.reduce((a, c) => a + c.qty, 0)}</td>
          // <td>{order.refundable || "N/A"}</td>
          // <td>{order.milestones.length || "N/A"}</td>
        }
        <td>₹{order.total}</td>
        <td>{order.status}</td>
        <td ref={actionsRef}>
          {batch.length === 0 && (
            <Actions icon={<Chev_down_svg />}>
              <Link to={`${history.location.pathname}/${order._id}`}>
                View Detail
              </Link>
              {order.status === "pending" && (
                <Link
                  to="#"
                  onClick={(e) => {
                    Confirm({
                      label: "Order Cancellation",
                      question: "You sure want to cancel this order?",
                      callback: cancelOrder,
                    });
                  }}
                >
                  Cancel order
                </Link>
              )}
              {order.status === "approved" && (
                <Link
                  to="#"
                  onClick={(e) => {
                    Confirm({
                      label: "Order Cancellation",
                      question:
                        "You sure want to request cancellation for this order?",
                      callback: requestCancellation,
                    });
                  }}
                >
                  Request Cancellation
                </Link>
              )}
            </Actions>
          )}
        </td>
      </tr>
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </>
  );
};
export const FullOrder = ({ history, match }) => {
  const { userType } = useContext(SiteContext);
  const [msg, setMsg] = useState(null);
  const [order, setOrder] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState(false);
  const [refundTill, setRefundTill] = useState(false);
  const [issueRefund, setIssueRefund] = useState(false);
  const milestoneTimeout = useRef();
  const updateOrder = async (newData) => {
    return fetch("/api/updateOrder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          return data.order;
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Orders does not exist.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not update order. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  };
  useEffect(() => {
    fetch(`/api/singleOrder?_id=${match.params._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setOrder(data.order);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Orders does not exist.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get order. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, []);
  useEffect(() => {
    if (order?.status === "delivered" && order?.refundable) {
      let days = 0;
      switch (order.refundable) {
        case "Upto 24 Hours After Delivery":
          days = 1;
          break;
        case "Upto 7 Days After Delivery":
          days = 7;
          break;
        case "Upto 15 Days After Delivery":
          days = 15;
          break;
        default:
          return;
      }
      const refundTill = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * days
      );
      if (new Date() < refundTill) {
        setRefundTill(refundTill);
      } else {
        setRefundTill(null);
      }
    } else {
      setRefundTill(null);
    }
  }, [order]);
  if (order) {
    const productPrice = order.products.reduce(
      (a, c) =>
        (a + calculatePrice({ product: c.product, gst: true }) * c.qty).fix(),
      0
    );
    const couponCodeDiscount =
      (order.coupon?.type === "percent" &&
        Math.min(
          (productPrice / 100) * order.coupon.amount,
          order.coupon.maxDiscount
        )) ||
      (order.coupon?.type === "flat" && order.coupon?.amount) ||
      0;
    const fee = (
      ((productPrice - couponCodeDiscount + order.shippingCost) / 100) *
      order.fee
    ).fix();
    return (
      <>
        <div className="actions">
          <Link
            to={`${
              history.location.pathname.replace("/" + match.params._id, "")
                ? history.location.pathname.replace("/" + match.params._id, "")
                : userType === "seller"
                ? "/account/orders"
                : "/account/orders/current"
            }`}
            className="back"
          >
            <Arrow_left_svg />
            Back
          </Link>
          {refundTill && (
            <button onClick={() => setIssueRefund(true)}>Issue refund</button>
          )}
        </div>
        <div className="singleOrder">
          <div className="summery">
            <h3>Order Summery</h3>
            <ul>
              <li>
                <label>Seller</label>
                <User user={order.seller} />
              </li>
              <li>
                <label>Order ID</label>
                {order._id}
              </li>
              <li>
                <label>Status</label>
                {order.status}
              </li>
              <li>
                <label>Order placed</label>
                <Moment format="DD MMM YYYY, hh:mma">{order.createdAt}</Moment>
              </li>
              {order.status === "delivered" && (
                <li>
                  <label>Delivered at</label>
                  <Moment format="DD MMM YYYY, hh:mm a">
                    {order.deliveredAt}
                  </Moment>
                </li>
              )}
              <li>
                <label>Refundable</label>
                {order.refundable || "N/A"}
              </li>
              <li>
                <label>Note</label>
                {order.note}
              </li>
              {refundTill && (
                <li>
                  <label>Refund till</label>
                  <Moment format="DD MMM YYYY, hh:mm a">{refundTill}</Moment>
                </li>
              )}
              <li></li>
              <li className="devide">
                <label>Delivery Address</label>
                <span />
              </li>
              <>
                {Object.entries(order.deliveryDetail).map(([key, value], i) =>
                  key === "deliveryTime" ? (
                    <li key={i}>
                      <label>Delivery date</label>
                      {order.deliveryDetail.deliveryTime ? (
                        <Moment format="DD MMM, YYYY hh:mma">
                          {order.deliveryDetail.deliveryTime}
                        </Moment>
                      ) : (
                        "N/A"
                      )}
                    </li>
                  ) : (
                    <li key={i}>
                      <label>{key}</label>
                      {value}
                    </li>
                  )
                )}
              </>
            </ul>
          </div>
          <div className="products">
            <h3>Products</h3>
            <ul>
              {order.products.map(({ product, qty }, i) => (
                <li key={i}>
                  <Img src={product.images[0] || "/open_box.png"} />
                  <div className="detail">
                    <p>{product.name}</p>
                    <p className="qty">QTY: {qty}</p>
                  </div>
                  <div className="price">
                    <span>
                      {calculatePrice({ product, gst: true })} x {qty}
                    </span>
                    ₹{calculatePrice({ product, gst: true }) * qty}
                  </div>
                </li>
              ))}
            </ul>
            <div className="total">
              <div className="data">
                <label>Total</label>₹{productPrice}
              </div>
              {order.coupon && (
                <>
                  <div className="data">
                    <label>
                      Coupon Code {order.coupon.code}
                      <br />
                      Discount{" "}
                      {order.coupon.type === "percent" ? (
                        <>
                          {order.coupon.amount}% (Upto ₹
                          {order.coupon.maxDiscount})
                        </>
                      ) : (
                        <>flat</>
                      )}
                    </label>
                    <span>₹{couponCodeDiscount}</span>
                  </div>
                </>
              )}
              <div className="data">
                <label>Shipping</label>₹{order.shippingCost || "N/A"}
              </div>
              <hr />
              <div className="data">
                <label>Delivery Pay fee {order.fee}%</label>₹{fee}
              </div>
              <hr />
              <div className="data">
                <label>Grand Total</label>₹{order.total}
              </div>
            </div>
          </div>
          <div className="milestones">
            <h3>
              Milestones
              {
                //   (order.status === "approved" ||
                //   order.status === "shipped" ||
                //   order.status === "delivered") && (
                //   <button onClick={() => setMilestoneForm(true)}>
                //     Create Milestone
                //   </button>
                // )
              }
            </h3>
            <p className="subtitle">Click to view milestone detail.</p>
            {
              //   {order.status == "pending" ? (
              //   <p>You can create milestones after seller accepts your order.</p>
              // ) : (
            }
            <table cellSpacing={0} cellPadding={0}>
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Descrption</td>
                  <td>Amount</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {order.milestones.map((milestone) => (
                  <tr
                    key={milestone._id}
                    onClick={() =>
                      history.push(`/account/hold?q=${milestone._id}`)
                    }
                  >
                    <td>
                      <Moment format="DD MMM YYYY, hh:mma">
                        {milestone.createdAt}
                      </Moment>
                    </td>
                    <td>{milestone.dscr}</td>
                    <td>₹{milestone.amount}</td>
                    <td>{milestone.status}</td>
                  </tr>
                ))}
                {order.milestones.length === 0 && (
                  <tr className="placeholdert">
                    <td>Nothing yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {
              // )}
            }
          </div>
          <div className="delivery">
            <h3>Proof of delivery</h3>
            {order.files?.length > 0 ? (
              <div className="thumbs">
                <Media links={order.files} />
              </div>
            ) : (
              <>No files added.</>
            )}
          </div>
          <section className="terms">
            <h3>Return Policy Terms</h3>
            <ul>
              {order.terms?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              {!order.terms?.length && (
                <li>No terms has been set by the seller yet.</li>
              )}
            </ul>
          </section>
        </div>
        <Modal
          head={true}
          label="Create Milestone"
          setOpen={setMilestoneForm}
          className="milestoneRequest"
          open={milestoneForm}
        >
          <MilestoneForm
            action="create"
            definedAmount={order.total}
            client={order.seller}
            order={order._id}
            onSuccess={(milestone) => {
              setMilestoneForm(false);
              setMsg(
                <>
                  <button onClick={() => setMsg(null)}>Okay</button>
                  <div>
                    <Succ_svg />
                    <h4 className="amount">₹{milestone?.amount}</h4>
                    <h4>Milestone has been created</h4>
                  </div>
                  <Link to="/account/hold" onClick={() => setMsg(null)}>
                    Check your Delivery pay Hold
                  </Link>
                </>
              );
              setOrder((prev) => ({
                ...prev,
                milestones: [...prev.milestones, milestone],
              }));
            }}
          />
        </Modal>
        <Modal
          open={issueRefund}
          head={true}
          label="Issue Refund"
          setOpen={setIssueRefund}
          className="issueRefund"
        >
          <RefundForm
            order={order}
            onSuccess={(refund) => {
              setIssueRefund(false);
              setOrder((prev) => ({ ...prev, status: "refundPending" }));
              setMsg(
                <>
                  <button onClick={() => setMsg(null)}>Okay</button>
                  <div>
                    <Succ_svg />
                    <h4>Refund has been issued.</h4>
                  </div>
                </>
              );
            }}
          />
        </Modal>
        <Modal className="msg" open={msg}>
          {msg}
        </Modal>
      </>
    );
  }
  return <>Loading</>;
};

const RefundForm = ({ order, onSuccess }) => {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState("");
  const [dscr, setDscr] = useState("");
  const [files, setFiles] = useState([]);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fileLinks = files.length ? await UploadFiles({ files, setMsg }) : [];
    fetch("/api/issueRefund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: order._id, issue, dscr, files: fileLinks }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.code === "ok") {
          onSuccess?.(data.refund);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Refund could not be issued. Try again.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Refund could not be issued. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  };
  return (
    <>
      <form onSubmit={submit}>
        <section>
          <label>Issue</label>
          <input
            type="text"
            required={true}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
        </section>
        <section>
          <label>Descrption</label>
          <TextareaAutosize
            required={true}
            value={dscr}
            onChange={(e) => setDscr(e.target.value)}
          />
        </section>
        <section className="images">
          <label>Upload relevant files</label>
          <FileInput
            accept="image/*, video/*, audio/*"
            multiple={true}
            onChange={(files) => setFiles(files)}
          />
        </section>
        <section className="btns">
          <button className="submit">Submit</button>
        </section>
      </form>
      {loading && (
        <div className="spinnerContainer">
          <div className="spinner" />
        </div>
      )}
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </>
  );
};

const Refunds = ({ history, location }) => {
  const { userType } = useContext(SiteContext);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState({
    column: "createdAt",
    order: "dsc",
  });
  const [dateRange, setDateRange] = useState(null);
  const [refunds, setRefunds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [batch, setBatch] = useState([]);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const startDate = moment({
      time: dateRange?.startDate,
      format: "YYYY-MM-DD",
    });
    const endDate = moment({
      time: new Date(dateRange?.endDate)?.setHours(24, 0, 0, 0),
      format: "YYYY-MM-DD",
    });
    fetch(
      `/api/getRefunds?${new URLSearchParams({
        user: userType,
        ...(search && { q: search }),
        page,
        perPage,
        sort: sort.column,
        order: sort.order,
        ...(dateRange && {
          dateFrom: startDate,
          dateTo: endDate,
        }),
        ...(status && { status }),
      })}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setRefunds(data.refunds);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get orders.</h4>
            </div>
          </>
        );
      });
  }, [search, page, perPage, dateRange, status]);
  useEffect(() => {
    if (selectAll) {
    } else {
      setBatch([]);
    }
  }, [selectAll]);
  useEffect(() => {
    if (batch.length === 0) {
      setSelectAll(false);
    }
  }, [batch]);
  return (
    <>
      <div className="benner">
        <p>My Refunds</p>
      </div>
      <div className="filters">
        <section>
          <label>Total:</label>
          {total}
        </section>
        <section>
          <label>Per Page:</label>
          <Combobox
            defaultValue={0}
            options={[
              { label: "20", value: 20 },
              { label: "30", value: 30 },
              { label: "50", value: 50 },
            ]}
            onChange={(e) => setPerPage(e.value)}
          />
        </section>
        <section className="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <path
              id="Icon_ionic-ios-search"
              data-name="Icon ionic-ios-search"
              d="M27.23,25.828l-6.4-6.455a9.116,9.116,0,1,0-1.384,1.4L25.8,27.188a.985.985,0,0,0,1.39.036A.99.99,0,0,0,27.23,25.828ZM13.67,20.852a7.2,7.2,0,1,1,5.091-2.108A7.155,7.155,0,0,1,13.67,20.852Z"
              transform="translate(-4.5 -4.493)"
              fill="#707070"
              opacity="0.74"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for Seller"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X_svg />
            </button>
          )}
        </section>
        <section className="category">
          <label>Status:</label>
          <Combobox
            defaultValue={0}
            options={[
              { label: "All", value: "" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Product Sent", value: "productSent" },
              { label: "Product Recieved", value: "productRecieved" },
              { label: "Resolved", value: "resolved" },
            ]}
            onChange={(e) => setStatus(e.value)}
          />
        </section>
        <section className={`date`}>
          <InputDateRange
            dateRange={dateRange}
            onChange={(range) => setDateRange(range)}
          />
        </section>
      </div>
      {batch.length > 0 && (
        <div className="batchAction">
          <button onClick={() => console.log("batch delete")}>Delete</button>
        </div>
      )}
      <table className="table refunds">
        <thead>
          <tr>
            {
              //   <th className="checkContainer">
              //   <Checkbox
              //     value={selectAll}
              //     defaultValue={selectAll}
              //     onChange={(e) => setSelectAll(e)}
              //   />
              // </th>
            }
            <th className="date">Date</th>
            <th>Seller</th>
            <th>QTY</th>
            <th>Status</th>
            <th>Total Price</th>
            {
              // <th>Actions</th>
            }
          </tr>
        </thead>
        <tbody>
          {refunds.map((refund) => (
            <SingleRefund
              key={refund._id}
              refund={refund}
              setRefunds={setRefunds}
              selectAll={selectAll}
              setBatch={setBatch}
              batch={batch}
            />
          ))}
          {refunds.length === 0 && (
            <tr className="placeholder">
              <td>No product yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        total={total}
        btns={5}
        currentPage={page}
        perPage={perPage}
        setPage={setPage}
      />
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </>
  );
};
const SingleRefund = ({ refund, setRefunds, selectAll, setBatch, batch }) => {
  const history = useHistory();
  const { user } = useContext(SiteContext);
  const [selected, setSelected] = useState(selectAll || false);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState(false);
  useEffect(() => {
    setSelected(selectAll);
  }, [selectAll]);
  useEffect(() => {
    if (selected) {
      setBatch((prev) => [...prev, refund._id]);
    } else {
      setBatch((prev) => prev.filter((item) => item !== refund._id));
    }
  }, [selected]);
  return (
    <>
      <tr
        className={`refund ${selected ? "selected" : ""}`}
        onClick={() =>
          history.push(`/account/myShopping/refunds/${refund._id}`)
        }
      >
        {
          //   <td className="checkContainer">
          //   <Checkbox
          //     defaultValue={selected}
          //     value={selected}
          //     onChange={(e) => {
          //       setSelected(e);
          //     }}
          //   />
          // </td>
        }
        <td className="date">
          <Moment format="DD MMM YYYY, hh:mm a">{refund.createdAt}</Moment>
        </td>
        <td>
          <User user={refund.seller} />
        </td>
        <td>{refund.order?.products.reduce((a, c) => a + c.qty, 0)}</td>
        <td>{refund.status}</td>
        <td>₹{refund.order.total}</td>
        {
          //   <td>
          //   {batch.length === 0 && (
          //     <Actions icon={<Chev_down_svg />}>
          //       <Link to="#" className="edit" onClick={() => setEdit(true)}>
          //         Edit
          //       </Link>
          //       <Link
          //         to="#"
          //         className="delete"
          //         onClick={() =>
          //           Confirm({
          //             label: "Removing Product",
          //             question: "You sure want to delete this product?",
          //             callback: removeProduct,
          //           })
          //         }
          //       >
          //         Delete
          //       </Link>
          //     </Actions>
          //   )}
          // </td>
        }
      </tr>
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </>
  );
};
const FullRefund = ({ history, match }) => {
  const { userType } = useContext(SiteContext);
  const [msg, setMsg] = useState(null);
  const [refund, setRefund] = useState(null);
  const [order, setOrder] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState(false);
  const [refundTill, setRefundTill] = useState(false);
  const milestoneTimeout = useRef();
  const updateRefund = async (newData) => {
    return fetch("/api/updateRefund", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newData, _id: refund._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          return data.order;
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Refund request does not exist.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not update refund. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  };
  useEffect(() => {
    fetch(`/api/singleRefund?_id=${match.params._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setOrder(data.refund.order);
          setRefund(data.refund);
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>Refund does not exist.</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get Refund. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, []);
  useEffect(() => {
    if (order?.refundable) {
      let days = 0;
      switch (order.refundable) {
        case "Upto 24 Hours After Delivery":
          days = 1;
          break;
        case "Upto 7 Days After Delivery":
          days = 7;
          break;
        case "Upto 15 Days After Delivery":
          days = 15;
          break;
        default:
          return;
      }
      const refundTill = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * days
      );
      if (new Date() < refundTill) {
        setRefundTill(refundTill);
      } else {
        setRefundTill(null);
      }
    } else {
      setRefundTill(null);
    }
  }, [refund]);
  if (refund) {
    return (
      <>
        <div className="actions">
          <Link
            to={`/account/${
              userType === "seller" ? "myShop" : "myShopping"
            }/refunds`}
            className="back"
          >
            <Arrow_left_svg />
            Back
          </Link>
          {refund.status === "approved" && (
            <button
              onClick={() =>
                Confirm({
                  label: "Product Shipped",
                  question: "Did you sent the product to seller?",
                  callback: () => {
                    updateRefund({ status: "productSent" }).then((refund) => {
                      setRefund((prev) => ({ ...prev, status: "productSent" }));
                    });
                  },
                })
              }
            >
              Product Sent
            </button>
          )}
          {refund.status === "productRecieved" && (
            <button
              onClick={() =>
                Confirm({
                  label: "Refund Resolved",
                  question: "You sure want to mark this refund resolved?",
                  callback: () => {
                    updateRefund({ status: "resolved" }).then((refund) => {
                      setRefund((prev) => ({ ...prev, status: "resolved" }));
                    });
                  },
                })
              }
            >
              Mark as Resolved
            </button>
          )}
        </div>
        <div className="singleOrder">
          <div className="summery">
            <h3>Summery</h3>
            <ul>
              <li className="devide">
                <label>Order</label>
                <span />
              </li>
              <li>
                <label>Seller</label>
                <User user={order.seller} />
              </li>
              <li>
                <label>Order ID</label>
                {order._id}
              </li>
              <li>
                <label>Status</label>
                {order.status}
              </li>
              <li>
                <label>Ordered at</label>
                <Moment format="DD MMM YYYY, hh:mma">{order.createdAt}</Moment>
              </li>
              <li>
                <label>Delivered at</label>
                <Moment format="DD MMM YYYY, hh:mm a">
                  {order.deliveredAt}
                </Moment>
              </li>
              <li>
                <label>Proof of delivery</label>
                {order.files?.length > 0 ? (
                  <div className="thumbs">
                    <Media links={order.files} />
                  </div>
                ) : (
                  <>No files added.</>
                )}
              </li>
              <li>
                <label>Refundable</label>
                {order.refundable || "N/A"}
              </li>
              {refundTill && (
                <li>
                  <label>Refund till</label>
                  <Moment format="DD MMM YYYY, hh:mm a">{refundTill}</Moment>
                </li>
              )}
              <li></li>
              <li className="devide">
                <label>Refund</label>
                <span />
              </li>
              <li>
                <label>Refund ID</label>
                {refund._id}
              </li>
              <li>
                <label>Status</label>
                {refund.status}
              </li>
              <li>
                <label>Submitted at</label>
                <Moment format="DD MMM YYYY, hh:mma">{refund.createdAt}</Moment>
              </li>
              <li>
                <label>Issue</label>
                {refund.issue}
              </li>
              <li>
                <label>Descrption</label>
                {refund.dscr}
              </li>
              <li>
                <label>Images</label>
                <div className="thumbs">
                  {refund.files.length ? (
                    <Media links={refund.files} />
                  ) : (
                    <>No Images has been provided.</>
                  )}
                </div>
              </li>
              <li></li>
              <li className="devide">
                <label>Delivery Address</label>
                <span />
              </li>
              <>
                {Object.entries(order.deliveryDetail).map(([key, value], i) =>
                  key === "deliveryTime" ? (
                    <li key={i}>
                      <label>Delivery date</label>
                      {order.deliveryDetail.deliveryTime ? (
                        <Moment format="DD MMM, YYYY hh:mma">
                          {order.deliveryDetail.deliveryTime}
                        </Moment>
                      ) : (
                        "N/A"
                      )}
                    </li>
                  ) : (
                    <li key={i}>
                      <label>{key}</label>
                      {value}
                    </li>
                  )
                )}
              </>
            </ul>
          </div>
          <div className="products">
            <h3>Products</h3>
            <ul>
              {order.products.map(({ product, qty }, i) => (
                <li key={i}>
                  <Img src={product.images[0] || "/open_box.png"} />
                  <div className="detail">
                    <p>{product.name}</p>
                    <p className="qty">QTY: {qty}</p>
                  </div>
                  <div className="price">
                    <span>
                      {calculatePrice({ product, gst: true })} x {qty}
                    </span>
                    ₹{calculatePrice({ product, gst: true }) * qty}
                  </div>
                </li>
              ))}
            </ul>
            <div className="total">
              <div className="data">
                <label>Total</label>₹{order.total - order.shippingCost}
              </div>
              {
                //   <div className="data">
                //   <label>Shipping</label>
                //   {order.shippingCost || "N/A"}
                // </div>
                // <div className="data">
                // <label>Grand Total</label>₹
                // {order.products.reduce(
                //   (a, c) =>
                //   a +
                //   calculatePrice({ product: c.product, gst: true }) * c.qty,
                //   0
                // ) + (+order.shippingCost || 0)}
                // </div>
              }
            </div>
          </div>
          <div className="milestones">
            <h3>
              Milestones
              {(refund.status === "approved" ||
                refund.status === "shipped" ||
                refund.status === "delivered") && (
                <button onClick={() => setMilestoneForm(true)}>
                  Request Milestone
                </button>
              )}
            </h3>
            {refund.status == "pending" ? (
              <p>You can create milestones after seller accepts your order.</p>
            ) : (
              <table cellSpacing={0} cellPadding={0}>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Descrption</td>
                    <td>Amount</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  {refund.milestones.map((milestone) => (
                    <tr
                      key={milestone._id}
                      onClick={() =>
                        history.push(`/account/hold?q=${milestone._id}`)
                      }
                    >
                      <td>
                        <Moment format="DD MMM YYYY, hh:mma">
                          {milestone.createdAt}
                        </Moment>
                      </td>
                      <td>{milestone.dscr}</td>
                      <td>₹{milestone.amount}</td>
                      <td>{milestone.status}</td>
                    </tr>
                  ))}
                  {refund.milestones.length === 0 && (
                    <tr className="placeholdert">
                      <td>Nothing yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <section className="terms">
            <h3>Return Policy Terms</h3>
            <ul>
              {order.terms?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
              {!order.terms?.length && (
                <li>No terms has been set by the seller yet.</li>
              )}
            </ul>
          </section>
        </div>
        <Modal
          head={true}
          label="Request Milestone"
          setOpen={setMilestoneForm}
          className="milestoneRequest"
          open={milestoneForm}
        >
          <MilestoneForm
            action="request"
            definedAmount={order.total - order.shippingCost}
            client={order.seller}
            refund={refund._id}
            onSuccess={(milestone) => {
              setMilestoneForm(false);
              setMsg(
                <>
                  <button onClick={() => setMsg(null)}>Okay</button>
                  <div>
                    <Succ_svg />
                    <h4 className="amount">₹{milestone?.amount}</h4>
                    <h4>Milestone has been requested</h4>
                  </div>
                  <Link to="/account/hold" onClick={() => setMsg(null)}>
                    Check your Delivery pay Hold
                  </Link>
                </>
              );
              setRefund((prev) => ({
                ...prev,
                milestones: [...prev.milestones, milestone],
              }));
            }}
          />
        </Modal>
        <Modal className="msg" open={msg}>
          {msg}
        </Modal>
      </>
    );
  }
  return <>Loading</>;
};

export const Disputes = ({ status }) => {
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({
    column: "createdAt",
    order: "dsc",
  });
  const [disputes, setDisputes] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [batch, setBatch] = useState([]);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    fetch(
      `/api/getDisputes?${new URLSearchParams({
        ...(search && { q: search }),
        page,
        perPage,
        sort: sort.column,
        order: sort.order,
        ...(status && { status }),
      })}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setDisputes(data.disputes);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get orders.</h4>
            </div>
          </>
        );
      });
  }, [search, page, perPage, status]);
  useEffect(() => {
    if (selectAll) {
    } else {
      setBatch([]);
    }
  }, [selectAll]);
  useEffect(() => {
    if (batch.length === 0) {
      setSelectAll(false);
    }
  }, [batch]);
  return (
    <div className="productContainer">
      {
        <div className="benner">
          <p>My Disputes</p>
        </div>
      }
      {
        //   <div className="filters">
        //   <section>
        //     <label>Total:</label>
        //     {total}
        //   </section>
        //   <section>
        //     <label>Per Page:</label>
        //     <Combobox
        //       defaultValue={0}
        //       options={[
        //         { label: "20", value: 20 },
        //         { label: "30", value: 30 },
        //         { label: "50", value: 50 },
        //       ]}
        //       onChange={(e) => setPerPage(e.value)}
        //     />
        //   </section>
        //   <section className="search">
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="23"
        //       height="23"
        //       viewBox="0 0 23 23"
        //     >
        //       <path
        //         id="Icon_ionic-ios-search"
        //         data-name="Icon ionic-ios-search"
        //         d="M27.23,25.828l-6.4-6.455a9.116,9.116,0,1,0-1.384,1.4L25.8,27.188a.985.985,0,0,0,1.39.036A.99.99,0,0,0,27.23,25.828ZM13.67,20.852a7.2,7.2,0,1,1,5.091-2.108A7.155,7.155,0,0,1,13.67,20.852Z"
        //         transform="translate(-4.5 -4.493)"
        //         fill="#707070"
        //         opacity="0.74"
        //       />
        //     </svg>
        //     <input
        //       value={search}
        //       onChange={(e) => setSearch(e.target.value)}
        //       placeholder="Search for Seller"
        //     />
        //     {search && (
        //       <button onClick={() => setSearch("")}>
        //         <X_svg />
        //       </button>
        //     )}
        //   </section>
        //   <section className="category">
        //     <label>Type:</label>
        //     <Combobox
        //       defaultValue={0}
        //       options={[
        //         { label: "All", value: "" },
        //         { label: "Product", value: "product" },
        //         { label: "Service", value: "service" },
        //         { label: "Other", value: "other" },
        //       ]}
        //       onChange={(e) => setType(e.value)}
        //     />
        //   </section>
        //   <section
        //     className={`date ${dateFilter ? "open" : ""}`}
        //     ref={dateFilterRef}
        //     onClick={() => setDateOpen(true)}
        //   >
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="30.971"
        //       height="30.971"
        //       viewBox="0 0 30.971 30.971"
        //     >
        //       <path
        //         id="Path_299"
        //         data-name="Path 299"
        //         d="M3.992,2.42H6.775V.968a.968.968,0,1,1,1.936,0V2.42H22.26V.968a.968.968,0,1,1,1.936,0V2.42h2.783a4,4,0,0,1,3.992,3.992V26.978a4,4,0,0,1-3.992,3.992H3.992A4,4,0,0,1,0,26.978V6.412A4,4,0,0,1,3.992,2.42ZM26.978,4.355H24.2v.968a.968.968,0,1,1-1.936,0V4.355H8.71v.968a.968.968,0,1,1-1.936,0V4.355H3.992A2.059,2.059,0,0,0,1.936,6.412v2.3h27.1v-2.3A2.059,2.059,0,0,0,26.978,4.355ZM3.992,29.035H26.978a2.059,2.059,0,0,0,2.057-2.057V10.646H1.936V26.978A2.059,2.059,0,0,0,3.992,29.035Z"
        //         fill="#336cf9"
        //       />
        //     </svg>
        //     {dateFilter && (
        //       <>
        //         <div className="dates">
        //           <p>
        //             From:{" "}
        //             <Moment format="DD MMM, YYYY">{dateRange.startDate}</Moment>
        //           </p>
        //           <p>
        //             To: <Moment format="DD MMM, YYYY">{dateRange.endDate}</Moment>
        //           </p>
        //         </div>
        //         <button
        //           className="clearDateFilter"
        //           onClick={() => {
        //             setDateRange({
        //               startDate: new Date(),
        //               endDate: new Date(),
        //             });
        //             setDateFilter(false);
        //           }}
        //         >
        //           <X_svg />
        //         </button>
        //       </>
        //     )}
        //   </section>
        // </div>
      }
      {batch.length > 0 && (
        <div className="batchAction">
          <button onClick={() => console.log("batch delete")}>Delete</button>
        </div>
      )}
      <table className="table disuptes">
        <thead>
          <tr>
            <th className="date">Raised at</th>
            <th>User</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute) => (
            <SingleDispute
              key={dispute._id}
              dispute={dispute}
              setDisputes={setDisputes}
            />
          ))}
          {disputes.length === 0 && (
            <tr className="placeholder">
              <td>No Dispute yet.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        total={total}
        btns={5}
        currentPage={page}
        perPage={perPage}
        setPage={setPage}
      />
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </div>
  );
};
const SingleDispute = ({ dispute, setDisputes }) => {
  const actionsRef = useRef();
  const checkRef = useRef();
  const history = useHistory();
  const { user } = useContext(SiteContext);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState(false);
  const client = dispute.plaintiff._id === user._id ? "defendant" : "plaintiff";
  return (
    <>
      <tr
        className={`dispute`}
        onClick={(e) => {
          if (
            e.nativeEvent.path.includes(actionsRef.current) ||
            e.nativeEvent.path.includes(checkRef.current)
          ) {
          } else {
            history.push(`${history.location.pathname}/${dispute._id}`);
          }
        }}
      >
        <td className="date">
          <Moment format="DD MMM YYYY">{dispute.createdAt}</Moment>
        </td>
        <td>
          <User user={dispute[client]} />
        </td>
        <td>{dispute.issue}</td>
        <td>{dispute.status}</td>
        <td ref={actionsRef}>
          <Actions icon={<Chev_down_svg />}>
            <Link to={`${history.location.pathname}/${dispute._id}`}>
              View Detail
            </Link>
          </Actions>
        </td>
      </tr>
      <Modal className="msg" open={msg}>
        {msg}
      </Modal>
    </>
  );
};
export const FullDispute = ({ history, location, match }) => {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    fetch(`/api/singleDispute?_id=${match.params._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setData(data.dispute);
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>Could not get Dispute. Make sure you're online.</h4>
            </div>
          </>
        );
      });
  }, []);
  if (data) {
    return (
      <div className={`singleDispute ${data.status}`}>
        <div className="disputeSummery">
          <div className="benner">Dispute Summery</div>
          <ul className="disputeDetail">
            <li>
              <label>Dispute ID:</label>
              <div className="data">{data._id}</div>
            </li>
            <li>
              <label>Status:</label>
              <div className="data">{data.status}</div>
            </li>
            <li>
              <label>Issue:</label>
              <div className="data">{data.issue}</div>
            </li>
            <li>
              <label>Issued by:</label>
              <div className="data">{data.plaintiff.role}</div>
            </li>
            <li>
              <label>Dispute filed:</label>
              <div className="data">
                <Moment format="hh:mm a, DD MMM, YYYY">{data.createdAt}</Moment>
              </div>
            </li>
            <li>
              <label>Milestone amount:</label>
              <div className="data">₹ {data.milestone.amount}</div>
            </li>
            <li>
              <label>Milestone description:</label>
              <div className="data">{data.milestone.dscr}</div>
            </li>
            <li>
              <label>Milestone products:</label>
              <div className="data">
                {data.milestone.products?.map((item, i) => (
                  <li key={i}>{item.name}</li>
                ))}
                {data.milestone.products?.length ? null : "No product selected"}
              </div>
            </li>
            <li>
              <label>Milestone created:</label>
              <div className="data">
                <Moment format="hh:mm a, DD MMM, YYYY">
                  {data.milestone.createdAt}
                </Moment>
              </div>
            </li>
          </ul>
        </div>
        <Case role="plaintiff" dispute={data} setData={setData} />
        <Case role="defendant" dispute={data} setData={setData} />
        <Modal open={msg} className="msg">
          {msg}
        </Modal>
      </div>
    );
  }
  return (
    <div className="singleDispute loading">
      <div className="disputeSummery">
        <div className="benner">Dispute Summery</div>
        <ul>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
        </ul>
      </div>
      <div className="plaintiff">
        <div className="benner">Plaintiff</div>
        <div className="user">
          <div className="img" />
          <div className="name" />
        </div>
        <ul className="detail">
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
        </ul>
      </div>
      <div className="defendant">
        <div className="benner">Defendant</div>
        <div className="user">
          <div className="img" />
          <div className="name" />
        </div>
        <ul className="detail">
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
          <li>
            <div />
            <div />
          </li>
        </ul>
      </div>
    </div>
  );
};

const Case = ({ role, dispute, setData }) => {
  const [msg, setMsg] = useState(null);
  const resolveDispute = (winner) => {
    fetch("/api/resolveDispute", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: dispute._id,
        winner,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "ok") {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Succ_svg />
                <h4>Dispute Successfully resolved.</h4>
              </div>
            </>
          );
          setData((prev) => ({
            ...prev,
            winner: data.dispute.winner,
            status: data.dispute.status,
          }));
        } else {
          setMsg(
            <>
              <button onClick={() => setMsg(null)}>Okay</button>
              <div>
                <Err_svg />
                <h4>{data.message}</h4>
              </div>
            </>
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(
          <>
            <button onClick={() => setMsg(null)}>Okay</button>
            <div>
              <Err_svg />
              <h4>
                Dispute Could not be resolved. Make sure you' a're online.
              </h4>
            </div>
          </>
        );
      });
  };
  return (
    <div
      className={`${role} ${dispute[role].role} ${
        dispute.winner === dispute[role]._id ? "winner" : ""
      }`}
    >
      <div className="benner">
        {role}
        {dispute.status === "pendingVerdict" && dispute.defendant.case?.dscr && (
          <button
            onClick={() =>
              Confirm({
                className: "disputeResolveConfirm",
                label: "Dispute resolve",
                question: (
                  <>
                    Are you sure{" "}
                    <span className="name">
                      {dispute[role].firstName + " " + dispute[role].lastName}
                    </span>{" "}
                    <span className="role">({role})</span> is the winner of this
                    dispute?
                  </>
                ),
                callback: () => resolveDispute(dispute[role]._id),
              })
            }
          >
            Winner
          </button>
        )}
        {dispute.winner === dispute[role]._id && (
          <p className="winnerTag">Winner</p>
        )}
      </div>
      <div className="content">
        <div className="user">
          <Img src={dispute[role].profileImg || "/profile-user.jpg"} />
          <p className="name">
            {dispute[role].firstName + " " + dispute[role].lastName}
            <span className="phone">{dispute[role].phone}</span>
          </p>
        </div>
        {dispute[role].case?.dscr ? (
          <ul className="detail">
            <li>
              <label>Role:</label> <div>{dispute[role].role}</div>
            </li>
            <li>
              <label>Current Balance:</label>{" "}
              <div>₹ {dispute[role].balance?.fix()}</div>
            </li>
            <li>
              <label>Case:</label>{" "}
              <div>{dispute[role].case?.dscr || "N/A"}</div>
            </li>
            <li>
              <label>Evidence:</label>{" "}
              <div className="thumbs">
                {dispute[role].case?.files?.length ? (
                  <Media links={dispute[role].case?.files} />
                ) : (
                  "N/A"
                )}
              </div>
            </li>
          </ul>
        ) : (
          <p className="noRes">Has not responded yet.</p>
        )}
      </div>
      <Modal open={msg} className="msg">
        {msg}
      </Modal>
    </div>
  );
};

const MyShopping = () => {
  const history = useHistory();
  const { userType } = useContext(SiteContext);
  const [msg, setMsg] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      });
  }, []);
  return (
    <>
      {userType === "seller" && <Redirect to="/account/myShop/orders" />}
      <div className="productContainer">
        <div style={{ display: "none" }}>
          <X_svg />
        </div>
        {
          //   <Tabs
          //   basepath="/account/myShopping/"
          //   tabs={[
          //     { label: "Orders", path: "orders" },
          //     { label: "Refunds", path: "refunds" },
          //   ]}
          // />
        }
        <Switch>
          <Route path="/account/orders/current/:_id" component={FullOrder} />
          <Route path="/account/orders/current">
            <Orders
              status="approved|shipped|refundPending"
              onClick={(_id) => history.push(`/account/orders/current/${_id}`)}
            />
          </Route>
          <Route path="/account/orders/pending/:_id" component={FullOrder} />
          <Route path="/account/orders/pending">
            <Orders
              status="pending"
              onClick={(_id) => history.push(`/account/orders/pending/${_id}`)}
            />
          </Route>
          <Route path="/account/orders/history/:_id" component={FullOrder} />
          <Route path="/account/orders/history">
            <Orders
              status="delivered|cancelled|declined|refunded"
              onClick={(_id) => history.push(`/account/orders/history/${_id}`)}
            />
          </Route>
          <Route path="/account/orders/dispute/:_id" component={FullDispute} />
          <Route path="/account/orders/dispute" component={Disputes} />
        </Switch>
        {
          // <Route path="/account/myShop/settings">
          //   <Settings categories={categories} setCategories={setCategories} />
          // </Route>
        }
        <Modal className="msg" open={msg}>
          {msg}
        </Modal>
      </div>
    </>
  );
};
export default MyShopping;
