# @ohbug-server/manager

1. 接收 transfer 传来的 event
2. 对 event 进行聚合 产生 issue 并将 event 存入 es
3. 产生 issue 的同时根据 apiKey 查询对应项目下的 notification 配置
4. 若符合 notification 的配置条件 将 notification 设置与 event/issue 信息一同传给 notifier
