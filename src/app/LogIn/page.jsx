import Styles from './login.module.css'

const Login = ()=>{
    return(
        <div className='wrapper'>
            <div className='form-box login'>
                <form action=''>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;