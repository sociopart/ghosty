import { useQuery, useMutation } from "@apollo/client";
import GetUser, { GET_USER_QUERY } from "../../callbacks/queries/GetUser.query"
import { accessToken, railsToken } from "../../config/variables";
import Cookies from "js-cookie";
import { SIGN_OUT_MUTATION } from "../../callbacks/mutations/signOut.mutation";

function UserInfoForm() {
  const [signOutUser, { loading1, error1 }] = useMutation(SIGN_OUT_MUTATION);
  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      var { data } = await signOutUser({
        variables: {},
        railsToken
      });
      console.log("success is:", data);
      if (data.signOut.success) {
        Cookies.remove('token');
      }
      // redirect or update state
    } catch (err) {
      console.log(err);
    }
  };

  const { loading, error, data } = useQuery(GET_USER_QUERY, accessToken);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(data);
    return (
      <div>
        <p>Error : {error.message}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Current user email is: {data.currentUser.email}</h2>
      <div className="user-actions">
        <h3>Available actions:</h3>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  );
}

export default UserInfoForm;