import { Post } from "./interfaces/post";
import { User } from "./interfaces/user";

export const mockPosts: Post[] = [
    {
        title: "עוגת שוקולד מושלמת",
        content: "עוגת שוקולד קלאסית, עשירה ולחה. מושלמת לכל אירוע!",
        owner: "oren_cohen",
        image: "https://images.unsplash.com/photo-1540337706094-da10342c93d8?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        _id: "1"
    },
    {
        title: "פיצה מרגריטה ביתית",
        content: "פיצה קלאסית עם בצק דק, רוטב עגבניות, מוצרלה ובזיליקום טרי.",
        owner: "oren_cohen",
        image: "https://images.unsplash.com/photo-1589187151053-5ec8818e661b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        _id: "2"
    },
    {
        title: "סלט קיסר עם עוף על האש",
        content: "סלט קיסר קלאסי עם רוטב ביתי, קרוטונים פריכים ועוף צלוי.",
        owner: "shira_levi",
        image: "https://plus.unsplash.com/premium_photo-1692309186600-03bb12fd3adb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        _id: "3"
    },
    {
        title: "שקשוקה חריפה",
        content: "שקשוקה עם עגבניות טריות, פלפלים חריפים וביצים עלומות. מושלמת לארוחת בוקר או ערב.",
        owner: "shira_levi",
        image: "https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        _id: "4"
    },
    {
        title: "חומוס ביתי קרמי",
        content: "חומוס חלק וטעים עם טחינה, לימון ושמן זית.",
        owner: "david_friedman",
        image: "https://images.unsplash.com/photo-1637949385162-e416fb15b2ce?q=80&w=2052&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        _id: "5"
    },
    {
        title: "מרק עדשים חורפי",
        content: "מרק עשיר ובריא עם עדשים אדומות, גזר, סלרי ותבלינים מחממים.",
        owner: "david_friedman",
        image: "https://plus.unsplash.com/premium_photo-1712678665862-3c51d1fac466?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        _id: "6"
    },
    {
        title: "פלאפל קריספי",
        content: "כדורי פלאפל טעימים ופריכים עם חומוס, כוסברה ותבלינים מזרח תיכוניים.",
        owner: "noa_barak",
        image: "https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFsYWZlbHxlbnwwfHwwfHx8MA%3D%3D",
        _id: "7"
    },
    {
        title: "לחם שום ביתי",
        content: "לחם שום פריך עם חמאה, שום ופרמזן.",
        owner: "noa_barak",
        image: "https://images.unsplash.com/photo-1593527270723-834c53a3fed4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FybGljJTIwYnJlYWR8ZW58MHx8MHx8fDA%3D",
        _id: "8"
    },
    {
        title: "עוף בלימון ושום",
        content: "חזה עוף עסיסי עם שום, לימון ועשבי תיבול טריים.",
        owner: "ran_mizrahi",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVtb24lMjBjaGlja2VufGVufDB8fDB8fHww",
        _id: "10"
    },
    {
        title: "עוגיות שיבולת שועל ושוקולד",
        content: "עוגיות בריאות וטעימות עם שיבולת שועל, שוקולד מריר ודבש.",
        owner: "tamar_gal",
        image: "https://images.unsplash.com/photo-1591899495446-836c1c873ae7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2F0bWVhbCUyMGNvb2tpZXN8ZW58MHx8MHx8fDA%3D",
        _id: "11"
    },
    {
        title: "קוסקוס מרוקאי עם ירקות",
        content: "מנה מסורתית של קוסקוס אוורירי עם ירקות מבושלים.",
        owner: "tamar_gal",
        image: "https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291c2NvdXN8ZW58MHx8MHx8fDA%3D",
        _id: "12"
    },
    {
        title: "לביבות בטטה קריספיות",
        content: "לביבות בטטה עם מרקם פריך מבחוץ ורך מבפנים.",
        owner: "yossi_nachum",
        image:"https://st1.foodsd.co.il/Images/Recipes/xxl/Recipe-10512-4tPDFg2wuPxEMd1K.jpg",
        _id: "13"
    },
    {
        title: "עוף טנדורי הודי",
        content: "עוף עסיסי בסגנון הודי במרינדת יוגורט ותבלינים אותנטיים.",
        owner: "yossi_nachum",
        image:"https://www.tamingtwins.com/wp-content/uploads/2024/07/tandoor-chicken-10.jpg",
        _id: "14"
    },
    {
        title: "טופו מוקפץ ברוטב חמאת בוטנים",
        content: "קוביות טופו קריספיות ברוטב חמאת בוטנים מתוק-חריף.",
        owner: "maya_ron",
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVhbnV0JTIwdG9mdXxlbnwwfHwwfHx8MA%3D%3D",
        _id: "15"
    },
    {
        title: "גוואקמולי מקסיקני אמיתי",
        content: "מטבל אבוקדו קלאסי עם בצל, עגבניות, כוסברה וליים.",
        owner: "maya_ron",
        image: "https://plus.unsplash.com/premium_photo-1681406689584-2f7612fa98a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3VhY2Ftb2xlfGVufDB8fDB8fHww",
        _id: "16"
    },
    {
        title: "ירקות מוקפצים בסגנון אסייתי",
        content: "ירקות צבעוניים מוקפצים בווק עם רוטב סויה וג'ינג'ר.",
        owner: "michael_rosen",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRifxMACQVgObsaITibheH0Vhq5vXfiK9O-eQ&s",
        _id: "17"
    },
    {
        title: "בורקס גבינות קריספי",
        content: "בורקס ביתי במילוי גבינה בולגרית ושכבות בצק פריך.",
        owner: "michael_rosen",
        image:"https://freshfoodinaflash.com/wp-content/uploads/2019/02/Joan-Nathans-Spinach-Feta-Burekas-4398-2-19.jpg",
        _id: "18"
    },
    {
        title: "מוס שוקולד קטיפתי",
        content: "מוס שוקולד עשיר ומענג עם קצפת מלמעלה.",
        owner: "yarden_maman",
        image: "https://images.unsplash.com/photo-1590080875852-ba44f83ff2db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hvY29sYXRlJTIwbW91c3NlfGVufDB8fDB8fHww",
        _id: "19"
    },
    {
        title: "פסטה פומודורו ביתית",
        content: "פסטה איטלקית קלאסית עם רוטב עגבניות טרי, שום ובזיליקום.",
        owner: "yarden_maman",
        image:"https://nataliecooks.com/wp-content/uploads/2024/06/Spaghetti-al-Pomodoro4.jpg",
        _id: "20"
    }
];


export const mockUsers: User[] = [
    {
        name: "Oren Cohen",
        password: "password123",
        email: "oren_cohen@example.com",
        profileImage: "https://example.com/oren-cohen.jpg",
        _id: "oren_cohen_1"
    },
    {
        name: "Shira Levi",
        password: "password123",
        email: "shira_levi@example.com",
        profileImage: "https://example.com/shira-levi.jpg",
        _id: "shira_levi_1"
    },
    {
        name: "David Friedman",
        password: "password123",
        email: "david_friedman@example.com",
        profileImage: "https://example.com/david-friedman.jpg",
        _id: "david_friedman_1"
    },
    {
        name: "Noa Barak",
        password: "password123",
        email: "noa_barak@example.com",
        profileImage: "https://example.com/noa-barak.jpg",
        _id: "noa_barak_1"
    },
    {
        name: "Ran Mizrahi",
        password: "password123",
        email: "ran_mizrahi@example.com",
        profileImage: "https://example.com/ran-mizrahi.jpg",
        _id: "ran_mizrahi_1"
    },
    {
        name: "Tamar Gal",
        password: "password123",
        email: "tamar_gal@example.com",
        profileImage: "https://example.com/tamar-gal.jpg",
        _id: "tamar_gal_1"
    },
    {
        name: "Yossi Nachum",
        password: "password123",
        email: "yossi_nachum@example.com",
        profileImage: "https://example.com/yossi-nachum.jpg",
        _id: "yossi_nachum_1"
    },
    {
        name: "Maya Ron",
        password: "password123",
        email: "maya_ron@example.com",
        profileImage: "https://example.com/maya-ron.jpg",
        _id: "maya_ron_1"
    },
    {
        name: "Michael Rosen",
        password: "password123",
        email: "michael_rosen@example.com",
        profileImage: "https://example.com/michael-rosen.jpg",
        _id: "michael_rosen_1"
    },
    {
        name: "Yarden Maman",
        password: "password123",
        email: "yarden_maman@example.com",
        profileImage: "https://example.com/yarden-maman.jpg",
        _id: "yarden_maman_1"
    }
];

