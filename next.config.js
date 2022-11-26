/** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
//     // images: {
//     //     unoptimized: true,
//     // },
//     images: {
//         loader: "imgix",
//         path: "/",
//     },
// }

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        loader: "akamai",
        path: "",
        domains: ["cdn.jsdelivr.net"],
    },
}

module.exports = nextConfig
