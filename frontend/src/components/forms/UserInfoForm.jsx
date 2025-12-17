import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_QUERY } from "../../callbacks/queries/GetUser.query";
import { SIGN_OUT_MUTATION } from "../../callbacks/mutations/signOut.mutation";
import { railsToken } from "../../config/variables";
import Cookies from "js-cookie";
import { LogOut } from "react-feather";

function UserInfoForm() {
  const [signOutUser, { loading: loadingSignOut }] = useMutation(SIGN_OUT_MUTATION);

  const { loading, error, data } = useQuery(GET_USER_QUERY, {
    variables: { railsToken },
  });

  const handleSignOut = async () => {
    try {
      const { data } = await signOutUser({
        variables: {},
      });

      if (data?.signOut?.success) {
        Cookies.remove('token');
        // добавить navigate('/login')
        window.location.href = '/'; // простой редирект
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !data?.currentUser) {
    return (
      <div className="alert alert-error shadow-lg max-w-md mx-auto mt-8">
        <span>Ошибка загрузки профиля: {error?.message || 'Неизвестная ошибка'}</span>
      </div>
    );
  }

  const user = data.currentUser;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 py-8">
      <div className="card w-full max-w-md shadow-xl bg-base-200">
        <div className="card-body items-center text-center gap-6">
          {/* Аватар (заглушка, если нет фото) */}
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={user.avatar || "https://i.pravatar.cc/300"} // заменить на реальное поле
                alt="User avatar"
              />
            </div>
          </div>

          <div>
            <h2 className="card-title text-2xl">{user.email}</h2>
            {/* Дополнительные поля */}
            {/* <p className="text-base-content/70">ID: {user.id}</p> */}
          </div>

          <div className="card-actions w-full">
            <button
              onClick={handleSignOut}
              disabled={loadingSignOut}
              className="btn btn-error w-full"
            >
              {loadingSignOut ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <LogOut size={20} />
                  Выйти
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfoForm;