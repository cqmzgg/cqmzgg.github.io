JSDelivr 是由 @Cloudflare 提供的免费开源公共 CDN。默认的提供的节点是 cdn.jsdelivr.net，但该节点在国内几乎不可用，需要使用可用性高的节点作为替代。
以下是一些常用的 JSDelivr 节点：

- gcore.jsdelivr.net: Gcore 节点，可用性高
- testingcf.jsdelivr.net: Cloudflare 节点，可用性高
- quantil.jsdelivr.net: Quantil 节点，可用性尚可
- fastly.jsdelivr.net: Fastly 节点，可用性尚可
- originfastly.jsdelivr.net: Fastly 节点，可用性低
- test1.jsdelivr.net: Cloudflare 节点，可用性低
- cdn.jsdelivr.net: 通用节点，可用性低

此外，还有第三方提供的 jsdelivr 节点，如 jsd.onmicrosoft.cn（国内 CDN）和 jsdelivr.b-cdn.net（台湾 CDN），国内速度很快，但稳定性不清楚。
对于 npm 节点，unpkg.com 在国内几乎不可用，可用以下国内 cdn 节点替代：

- npm.elemecdn.com
- npm.onmicrosoft.cn
- unpkg.zhimg.com
- npm.akass.cn
- cdn.chuqis.com/npm/
- code.bdstatic.com/npm

这些节点同步速度不同，但都需要准确的版本号。
总的来说，选择合适的 JSDelivr 节点可以提高项目在国内的可用性。如果您需要更多帮助，请随时告诉我。
#JSDelivr CDN 加速