import MainFooter from "../components/MainFooter";
import FrontProperties from "./FrontPropertyList";
import Navbar from "../components/Navbar";
import Search from "./Search";
import AgentList from "./AgentList";

const HeroPage = () => {
    return (
        <div>
            <Navbar />
            <div className="header bg-white p-0 position-relative">
                <div className="row g-0 align-items-center">
                    {/* Background Image Container */}
                    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                        <img
                            src="/img/bg.jpg"
                            alt="background image"
                            style={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                                filter: 'blur(2px)',
                            }}
                        />
                        {/* Overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                        ></div>
                        {/* Hero Text + Search */}
                        <div
                            className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3"
                        >
                            {/* Heading */}
                            <h1
                                style={{
                                    fontSize: 'clamp(1.5rem, 5vw, 3.5rem)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                }}
                            >
                                Find Your Best Property
                            </h1>

                    
                            <div
                                className=" shadow-lg mx-auto"
                                style={{
                                    maxWidth: '900px',
                                    width: '100%',
                            
                                }}
                            >
                
                                    <Search />
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <FrontProperties />
            </div>
            <div className="container mt-5">
                <AgentList />
            </div>
            <MainFooter />
        </div>
    );
};

export default HeroPage;
