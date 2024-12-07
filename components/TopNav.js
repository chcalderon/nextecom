import Link from "next/link";

export default function TopNav() {
    return (
        <nav className="nav shadow p-2 justify-content-between mb-3">
            <Link href="/" className="nav-link">
                🛒 Vintage & Estilo
            </Link>

            <div className="d-flex">
                <Link href="/login" className="nav-link">Login</Link>
            </div>
            <div className="d-flex">
                <Link href="/register" className="nav-link">Register</Link>
            </div>
        </nav>
    )
}