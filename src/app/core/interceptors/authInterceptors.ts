import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // ✅ Cambiar a "AccessToken" con mayúscula
    const token = localStorage.getItem("accessToken")  

    
    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        return next(cloned)
    }

    return next(req)
}