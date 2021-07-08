import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, Redirect, useHistory } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import D20Svg from '../svgs/D20Svg';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signup, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await signup(email, password);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
        setLoading(false);
        history.push('/');
    }

    return (
        <>
            {currentUser && <Redirect to={'/'} />}
            <div className="login-container">
                <Card className="login-card">
                    <div className="login-image">
                        <D20Svg loading={loading} />
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form className="login-body" onSubmit={handleSubmit}>
                        <h2 className="register-header">Register Account</h2>
                        <Form.Group id="email">
                            <Form.Control
                                type="email"
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder={' ✉️  ️  Email'}
                                maxLength={'40'}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Control
                                type="password"
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder={' 🔒   Password'}
                                maxLength={'30'}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Control
                                type="password"
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                                placeholder={' 🔒   Confirm Password'}
                                maxLength={'30'}
                                required
                            />
                        </Form.Group>
                        <Button disabled={loading} type="submit">
                            {'REGISTER ACCOUNT'}
                        </Button>
                        <div className="register-link">
                            <Link to="/login">
                                {'Already have an Account? Log In 🠖'}
                            </Link>
                        </div>
                    </Form>
                </Card>
            </div>
        </>
    );
}
