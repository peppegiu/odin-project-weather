const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ─── Entry & Output ───────────────────────────────────────────────
  entry: "./src/index.js",

  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[hash][ext][query]",
    clean: true, // limpa a pasta dist a cada build
  },

  // ─── Mode ─────────────────────────────────────────────────────────
  mode: process.env.NODE_ENV === "production" ? "production" : "development",

  // ─── DevServer ────────────────────────────────────────────────────
  devServer: {
    static: "./dist",
    port: 3000,
    hot: true,
    // proxy para evitar CORS em dev (não afeta fetch em produção)
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

  // ─── Loaders ──────────────────────────────────────────────────────
  module: {
    rules: [
      // 1. HTML loader
      // Processa arquivos .html importados como strings no JS.
      // O HtmlWebpackPlugin cuida do index.html principal (ver plugins).
      {
        test: /\.html$/i,
        use: [
          {
            loader: "html-loader",
            options: {
              // Processa automaticamente src de <img>, <source>, etc.
              sources: true,
              // Minimiza o HTML em produção
              minimize: process.env.NODE_ENV === "production",
            },
          },
        ],
      },

      // 2. CSS loader
      // MiniCssExtractPlugin.loader → extrai para arquivo .css separado
      // css-loader            → resolve @import e url()
      // postcss-loader        → autoprefixer / transformações pós-CSS
      {
        test: /\.css$/i,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // extrai CSS em produção
            : "style-loader",            // injeta <style> em dev (HMR)
          {
            loader: "css-loader",
            options: {
              modules: false,   // true para CSS Modules
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
        ],
      },

      // 3. PNG loader (Asset Modules — nativo desde webpack 5)
      // type: "asset"         → decide automaticamente inline vs arquivo
      //   < 8 KB  → data URL (inline)
      //   >= 8 KB → emite arquivo em /assets/
      {
        test: /\.png$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8 KB
          },
        },
        generator: {
          filename: "assets/images/[name].[hash:8][ext]",
        },
      },

      // 4. SVG loader
      // Estratégia dupla:
      //   • Importado como componente React  → @svgr/webpack
      //   • Importado como URL/string normal → asset/resource
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/, // apenas quando importado de JS/TS
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: true,          // otimiza o SVG
              titleProp: true,     // adiciona prop `title` acessível
              ref: true,
            },
          },
          // Fallback para uso como URL (ex.: CSS background-image)
          {
            loader: "url-loader",
            options: {
              limit: 4 * 1024, // < 4 KB → inline data URL
              name: "assets/icons/[name].[hash:8][ext]",
            },
          },
        ],
      },

      // 5. JS / JSX (Babel) — bônus para completar um setup real
      {
        test: /\.[jt]sx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],    
  },

  // ─── Plugins ──────────────────────────────────────────────────────
  plugins: [
    // Gera o index.html automaticamente injetando o bundle
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),

    // Extrai CSS em arquivo separado (produção)
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash].css",
    }),
  ],

  // ─── Resolve ──────────────────────────────────────────────────────
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "src"), // import de "@/components/..."
    },
  },

  // ─── Source Maps ──────────────────────────────────────────────────
  devtool: process.env.NODE_ENV === "production"
    ? "source-map"
    : "eval-cheap-module-source-map",
};
