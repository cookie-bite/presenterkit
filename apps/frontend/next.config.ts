import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
      // use: [
      //   {
      //     loader: '@svgr/webpack',
      //     options: {
      //       svgo: true,
      //       svgoConfig: {
      //         plugins: [
      //           {
      //             name: 'preset-default'
      //           }
      //         ]
      //       }
      //     }
      //   }
      // ]
    });
    return config;
  },
};

export default nextConfig;
