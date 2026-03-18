import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Utensils } from 'lucide-react';

const VerifyEmail = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                // Simulate a slight delay for a smoother "verifying" experience
                await new Promise(resolve => setTimeout(resolve, 2000));
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email/${uid}/${token}/`);
                setStatus('success');
                setMessage(response.data.message || 'Your account has been successfully verified! Welcome to the family.');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Invalid or expired verification link.');
            }
        };

        if (uid && token) {
            verifyAccount();
        }
    }, [uid, token]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundImage: 'url("/assets/verification_bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '20px',
            position: 'relative'
        }}>
            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 1
            }}></div>

            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '50px 40px',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
                maxWidth: '450px',
                width: '100%',
                zIndex: 2,
                color: 'white'
            }}>
                <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)',
                        padding: '15px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Utensils size={32} color="black" />
                    </div>
                    <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                         <span style={{ fontSize: '24px', fontWeight: '800', color: '#F9CB28' }}>Swaad</span>
                         <span style={{ fontSize: '24px', fontWeight: '400', color: 'white', marginLeft: '5px' }}>Indian Bistro</span>
                    </div>
                </div>

                {status === 'verifying' && (
                    <>
                        <Loader2 size={64} color="#F9CB28" className="animate-spin" style={{ margin: '0 auto 24px', opacity: 0.8 }} />
                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>Verifying Identity</h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', lineHeight: '1.5' }}>We're authenticating your account. Just a moment while we prepare your culinary journey.</p>
                    </>
                )}

                {status === 'success' && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <CheckCircle size={80} color="#4BB543" style={{ margin: '0 auto 24px' }} />
                        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#FFFFFF' }}>Welcome!</h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '17px', marginBottom: '35px', lineHeight: '1.6' }}>{message}</p>
                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                background: 'linear-gradient(135deg, #FF4D4D 0%, #F9CB28 100%)',
                                color: 'black',
                                border: 'none',
                                padding: '16px 40px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 10px 20px rgba(255, 77, 77, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 15px 30px rgba(255, 77, 77, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 77, 77, 0.3)';
                            }}
                        >
                            Log In to Your Account
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <XCircle size={80} color="#FF4D4D" style={{ margin: '0 auto 24px' }} />
                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px', color: '#FF4D4D' }}>Verification Failed</h2>
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px', marginBottom: '35px' }}>{message}</p>
                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                color: 'white',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '12px 30px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default VerifyEmail;
