import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <>
            <nav>
            <svg width="1024" height="700" viewBox="0 0 270.93 185.21">
                {/* SVG Definitions */}
                <defs>
                    {/* The top text path from the Home component */}
                    <path id="top" d="m48.408 68.144c42.161-82.72 144.28-60.66 163.31 2.8989" />
                    {/* Circular path from the Header component */}
                    <path id="round-path" d="m56.553 129.12c21.68 48.103 107.98 72.271 143.01 1.9326" />
                </defs>

                {/* Main group for the content */}
                <g className="main-group">
                    {/* Image from the Home component */}
                    <image href="https://th.bing.com/th/id/R.1cb4ecc80c996e808fad43b795980f5a?rik=nnyRCR9n4Pf1Fw&pid=ImgRaw&r=0" />

                    {/* Top text from the Home component */}
                    <text className="text-top">
                        <textPath startOffset="50%" href="#top">Username</textPath>
                    </text>

                    {/* Bottom text and links from the Header component */}
                    <text className="text-bottom">
                        <textPath href="#round-path" startOffset="50%" textAnchor="middle">
                            <tspan>
                                <Link to="/">Home</Link> |<Link to="/connecting">Profile</Link> |<Link to="/">Upload</Link>
                            </tspan>
                        </textPath>
                    </text>
                </g>
            </svg>
        </nav>
        </>
    );
};

export default Header;