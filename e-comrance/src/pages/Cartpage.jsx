import { FaShoppingBasket } from "react-icons/fa";
import Navbar from "./../components/navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Services, { deleteCartItem, getUserData } from "../services/Services";
import { initializecart } from "../../reducer/cartReducer";
import "../styles/CartStyles.css";
import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Steps, Input, Button } from "antd";
import { CiCreditCard1 } from "react-icons/ci";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/LoadSpinner.jsx";
import { addNotification } from "../../reducer/notificationReducer";
import React from "react";

const Cartpage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFillInformation, setShowFillInformation] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spinTip, setSpinTip] = useState("");
  const [user, setUser] = useState([]);

  const cartItems = useSelector((state) => {
    return state.cart;
  });

  console.log("cart", cartItems);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpinTip("Loading cart items");
        setLoading(true);
        const user = JSON.parse(sessionStorage.getItem("loggedNoteappUser"));
        const response = await getUserData(user);
        setUser(response);
        const listings = await Services.getAllCartItems();
        console.log("Listings", listings);
        const validListings = listings.filter(
          (item) => item !== undefined && item !== null && item !== ""
        );
        if (validListings.length === 0) {
          console.log("validate");
          dispatch(initializecart([]));
          setLoading(false);
          return;
        } else {
          console.log("else");
          dispatch(initializecart(validListings));
          console.log("Valid Listings", validListings);
          setLoading(false);
        }
      } catch (error) {
        if (error.status === 401) {
          navigate("/login");
          dispatch(
            addNotification(
              "Please login first so we can keep your cart up to date",
              "error"
            )
          );
        }
        setLoading(false);
        console.error("Error fetching listings:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemDelete = async (id) => {
    try {
      setSpinTip("Deleting item");
      setLoading(true);
      console.log(id);
      const response = await deleteCartItem(id);
      dispatch(initializecart(response));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartItems.reduce((acc, item) => {
        return acc + item.price;
      }, 0);
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cartItems]);

  const handleCheckout = () => {
    if (!user) {
      alert("Please login first");
      return;
    }
    navigate("/checkout");
    if (!user[0].name) {
      setShowCheckout(true);
      setShowFillInformation(true);
    } else {
      setShowCheckout(true);
      setShowConfirm(true);
    }
  };

  return (
    <div>
      <div>
        <Navbar />
        User Profile <FaShoppingBasket />
      </div>
      <div id="listingstyle">
        {cartItems.map((listing) => (
          <div key={listing.id} id="listing">
            <div>
              <img
                src="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*" // assuming you have an 'imageUrl' property
                alt={listing.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ margin: 5 }}>Name: {listing.name}</div>
            <div style={{ margin: 5 }}>Country: {listing.country}</div>
            <div style={{ margin: 5 }}>
              Price: {listing.price} {listing.currency}
            </div>
            <div style={{ margin: 5 }}>Description: {listing.description}</div>
            <Button
              style={{ margin: 5 }}
              type="primary"
              onClick={() => handleItemDelete(listing.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
      <div>
        <h2>Total price: {totalPrice} €</h2>
      </div>
      <div>
        <Button type="primary" onClick={handleCheckout}>
          Check out
        </Button>
      </div>
      {showCheckout && (
        <div>
          <Steps
            items={[
              {
                title: "Fill information",
                status: "process",
                icon: <LoadingOutlined />,
              },
              {
                title: "Confirm",
                status: "wait",
                icon: <SolutionOutlined />,
              },
              {
                title: "Pay",
                status: "wait",
                icon: <CiCreditCard1 />,
              },
              {
                title: "Done",
                status: "wait",
                icon: <SmileOutlined />,
              },
            ]}
          />
          {showFillInformation && (
            <div>
              <Input type="text" placeholder="Name" value={user[0].name} />
              <Input
                type="text"
                placeholder="Address"
                value={user[0].address}
              />
              <Input type="text" placeholder="Email" value={user[0].email} />
              <Button type="primary">Submit</Button>
            </div>
          )}
          {showConfirm && (
            <div>
              <div>
                <h2>Confirm your order</h2>
                <h3>Total price: {totalPrice} €</h3>
              </div>
              <PaymentElement />
            </div>
          )}
        </div>
      )}
      <Spinner loading={loading} spinTip={spinTip} />
    </div>
  );
};

export default Cartpage;
