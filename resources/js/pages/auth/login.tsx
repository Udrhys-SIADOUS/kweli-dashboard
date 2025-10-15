import { Form, Head, useForm } from '@inertiajs/react';
import { FaGoogle, FaFacebook, FaGithub, FaApple, FaMobile, FaEnvelope, FaMobileAlt } from "react-icons/fa";
import { LoaderCircle, Mail, Phone, Globe } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import TextLink from '@/components/text-link';
import { register, login } from '@/routes';
import { useState } from 'react';
import { route } from 'ziggy-js';

export default function Login() {
    const [method, setMethod] = useState<'email' | 'phone' | 'google' | 'facebook' | 'github' | 'apple'>('phone');

    const { data, setData, post, processing, errors } = useForm({
        login_method_type: 'phone',
        value: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <AuthLayout
            title="Se connecter"
            description="Entrez vos identifiants pour accéder à votre compte"
        >
            <Head title="Login" />
            
            <Form method="post" className="flex flex-col gap-6 p-6 border rounded-lg shadow-lg">
                <div className="grid gap-4">
                    {/* Type de méthode */}
                    <input
                        type="hidden"
                        name="login_method_type"
                        value={method}
                    />
                    {/* --- Choix de la méthode de connexion --- */}
                    <div className="grid grid-cols-2 gap-6">
                        <Button
                            type="button"
                            variant={method === 'phone' ? 'default' : 'outline'}
                            onClick={() => {
                                setMethod('phone');
                                setData('login_method_type', 'phone');
                            }}
                        >
                            <FaMobileAlt />
                            Téléphone
                        </Button>
                        <Button
                            type="button"
                            variant={method === 'email' ? 'default' : 'outline'}
                            onClick={() => {
                                setMethod('email');
                                setData('login_method_type', 'email');
                            }}
                        >
                            <FaEnvelope />
                            E-mail
                        </Button>
                    </div>

                    <div>
                        <Label htmlFor="value">
                            {data.login_method_type === 'email' ? 'Adresse e-mail' : 'Téléphone'}
                        </Label>
                        <Input
                            id="value"
                            type={data.login_method_type === 'email' ? 'email' : 'tel'}
                            name="value"
                            value={data.value}
                            onChange={(e) => setData('value', e.target.value)}
                            required
                            placeholder={
                                data.login_method_type === 'email'
                                ? 'ex: exemple@mail.com'
                                : 'ex: 0622334455'
                            }
                        />
                        <InputError message={errors.value} />
                    </div>

                    <div>
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Votre mot de passe"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing ? 
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> 
                                Connexion en cours...
                            </>
                            : "Se connecter"
                        }
                    </Button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm mb-3">Ou se connecter avec</p>
                    <div className="flex justify-center gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('google');
                                window.location.href = '/google/redirect'
                            }}
                            >
                            <FaGoogle className="text-google" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('facebook');
                                window.location.href = '/facebook/redirect'
                            }}
                        >
                            <FaFacebook className="text-facebook" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('github');
                                window.location.href = '/github/redirect'
                            }}
                        >
                            <FaGithub className="text-github" />
                            
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setMethod('apple');
                                window.location.href = '/apple/redirect'
                            }}
                        >
                            <FaApple className="text-apple" />
                        </Button>
                    </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Pas encore de compte ? <br></br>
                    <TextLink href={register()}>S'inscrire</TextLink>
                </div>
            </Form>
        </AuthLayout>
    );
}
