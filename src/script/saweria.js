import axios from "axios";
import cheerio from "cheerio";

export async function LoginSaweria(email, password) {
    try {
        const res = await axios("https://backend.saweria.co/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({ email, password })
        });

        const { data } = res.data;
        if (!data) return "Invalid email or password";
        return data;
    } catch (e) {
        console.error(e);
    }
}

export async function createPayment(amount, message = "Order") {
    try {
        const res = await axios("https://backend.saweria.co/donations/83ca4194-6e3c-4c87-bf38-2cc0e0489bf0", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                agree: true,
                amount: Number(amount),
                customer_info: {
                    first_name: `xyzen-${Date.now()}`,
                    email: 'owner@xyzen.tech',
                    phone: '',
                },
                message,
                notUnderAge: true,
                payment_type: 'qris',
                vote: ''
            })
        })

        return res.data;
    } catch (e) {
        console.error(e);
    }
}

export async function checkPaymentStatus(id) {
    try {
        const res = await axios(`https://saweria.co/receipt/${id}`, {
            method: "GET",
            headers: {
                "Accept": "*/*"
            }
        });

        const $ = cheerio.load(res.data);
        const msg = $('h2.chakra-heading.css-14dtuui').text();
        if (!msg) return "Unknown";
        return msg
    } catch (e) {
        console.error(e);
    }
}