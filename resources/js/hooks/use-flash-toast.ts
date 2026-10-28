import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashSharedProp, FlashToast } from '@/types/ui';

let lastDispatchedSignature: string | null = null;
let visitCounter = 0;
let initialChecked = false;

function dispatchFlashOnce(flash: FlashSharedProp | undefined | null): void {
    if (!flash) {
        return;
    }

    const success = flash.success ?? null;
    const error = flash.error ?? null;
    const status = flash.status ?? null;
    const customToast = flash.toast ?? null;

    if (!success && !error && !status && !customToast) {
        return;
    }

    const signature = JSON.stringify({
        visit: visitCounter,
        success,
        error,
        status,
        toast: customToast,
    });

    if (signature === lastDispatchedSignature) {
        return;
    }

    lastDispatchedSignature = signature;

    if (customToast) {
        toast[customToast.type](customToast.message);
    }

    if (success) {
        toast.success(success);
    }

    if (error) {
        toast.error(error);
    }

    if (status) {
        toast.info(status);
    }
}

function checkInitialFlash(): void {
    if (initialChecked || typeof window === 'undefined') {
        return;
    }

    initialChecked = true;

    try {
        const appElement = document.getElementById('app');
        const pageData = appElement?.getAttribute('data-page');
        if (pageData) {
            const parsed = JSON.parse(pageData) as {
                props?: { flash?: FlashSharedProp };
            };
            dispatchFlashOnce(parsed.props?.flash);
        }
    } catch {
        // Ignore JSON parse errors on invalid dataset
    }
}

export function useFlashToast(): void {
    useEffect(() => {
        checkInitialFlash();

        const unregisterNavigate = router.on('navigate', (event) => {
            visitCounter += 1;
            const pageProps = event.detail.page.props as {
                flash?: FlashSharedProp;
            };
            dispatchFlashOnce(pageProps?.flash);
        });

        const unregisterFlash = router.on('flash', (event) => {
            visitCounter += 1;
            const detailFlash = event.detail.flash as
                | {
                      toast?: FlashToast;
                      success?: string;
                      error?: string;
                      status?: string;
                  }
                | undefined;

            if (detailFlash) {
                dispatchFlashOnce(detailFlash);
            }
        });

        return () => {
            unregisterNavigate();
            unregisterFlash();
        };
    }, []);
}
