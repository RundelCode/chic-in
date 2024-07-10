import Image from "next/image";
import Styles from "./Navbar.module.css"
import Link from "next/link";

const Navbar = ()=>{
    return(
        <span className={Styles.navbar}>
            <Image className={Styles.logo} src='/images/Logo.png' alt="Chic In" width={'200'} height={'200'}/>
            <div className={Styles.links}>
                <Link className={Styles.link} href={'/'}>Solicitar un servicio</Link>
                <Link className={Styles.link} href={'/Profile'}>Mi perfil</Link>
            </div>
        </span>
    )
}
export default Navbar;