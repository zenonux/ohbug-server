# Ohbug Server

<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/ohbug-org/ohbug-website/master/static/images/dashboard-issues.png" alt="dashboard-issues">
  <img width="300" src="https://raw.githubusercontent.com/ohbug-org/ohbug-website/master/static/images/dashboard-event.png" alt="dashboard-event">
</p>

## 简介

这里是 Ohbug 控制台的后端部分。

我们将之拆分为 [dashboard](./packages/dashboard)、[manager](./packages/manager)、[notifier](./packages/notifier)、[transfer](./packages/transfer) 四大模块，分别处理整个平台的 API、Event 与 Issue 的处理、通知的发放、Event 接收转化四大功能。

## 关于开源

推荐使用 [Ohbug 官方服务](https://ohbug.net)，省去部署烦恼。

Ohbug 遵循 [Apache License 2.0](./LICENSE) 开源协议，可私有部署到自有服务器。

## 私有部署

> [部署文档](./setup.md)

## License

This project is licensed under the terms of the [Apache License 2.0](./LICENSE).
