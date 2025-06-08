'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-200 dark:from-gray-900 dark:to-blue-900 p-4 transition-colors duration-300">
      <Card className="w-full max-w-sm md:max-w-md shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
            Code Verification
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
            Enter the 6-digit code sent to your registered email or phone number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-3">
            <Input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-lg font-medium tracking-widest border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400 font-medium text-center">
                {error}
              </p>
            )}
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Verify Code
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}