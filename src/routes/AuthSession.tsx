import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { session } from "../consts";
import { toast } from "react-toastify";

const AuthSession = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authCode = searchParams.get('auth_code');

  useEffect(() => {
    if (authCode == null) {
        navigate('/auth');
    } else {
        session.post('auth/retrieve', {auth_code: authCode}).then((res) => {
            toast.success("Account verified Successfully.");
            localStorage.setItem('user', JSON.stringify(res.data['user']));
            navigate('/dashboard')
        }).catch(() => {
            toast.error("Login expired, please try again later.")
            navigate('/auth');
        })
    }
  }, [])

  return (
    <div>AuthSession</div>
  )
}

export default AuthSession