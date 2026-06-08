# scRNA-seq 标准流程（QC → 聚类 → 注释）

> 适用：10x 或类似表达矩阵。目标：从原始数据到可交付结果（图 + 表 + 关键结论）。

## 1. 本教程输出物
- 细胞过滤阈值（nFeature、nCount、percent.mt）
- UMAP + 细胞类型注释图
- Marker 基因表（Top markers）
- 关键 QC 图（violin / scatter）

## 2. 输入数据与目录规范
建议目录：
- data/
  - raw/
  - meta/
- output/
  - qc/
  - umap/
  - markers/

## 3. Step-by-step（最小闭环）
### 3.1 读取数据
```r
# Seurat 示例
obj <- Read10X(data.dir = "data/raw/filtered_feature_bc_matrix/")
seu <- CreateSeuratObject(obj)
