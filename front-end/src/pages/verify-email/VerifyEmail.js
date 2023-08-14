import "./verify-email.css";
import { Link,useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyEmail } from "../../redux/apiCalls/authApiCall";
import {GoVerified} from 'react-icons/go'
const VerifyEmail = () => {
  const dispatch = useDispatch();

  const { isEmailVerified } = useSelector(state => state.auth);

  const { userId, token } = useParams();

  useEffect(() => {
    dispatch(verifyEmail(userId , token));
  }, [userId, token]);

  return (
    <section className="verfiy-email">
      {isEmailVerified ? (
        <>
          <GoVerified className="verify-email-icon"/>
          <h1 className="verfiy-email-title">
            Your email address has been successfully verified
          </h1>
          <Link to="/login" className="verify-email-link">
            Go To Login Page
          </Link>
        </>
      ) : (
        <>
          <h1 className="verify-email-not-found">Not Found</h1>
        </>
      )}
    </section>
  );
};

export default VerifyEmail;