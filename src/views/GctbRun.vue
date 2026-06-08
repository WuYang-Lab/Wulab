<template>
  <div class="wrap">
    <!-- ① SBayesS -->
    <div class="card">
      <h2>① SBayesS（按染色体批量运行）</h2>
      <form @submit.prevent="submitForm('run_s', sbayess)">
        <div class="row">
          <div>
            <label>GWAS summary（.ma）</label>
            <input type="file" @change="onFileChange($event, 'sbayess')" required />
            <div class="small">列：SNP A1 A2 freq b se p N</div>
          </div>
          <div>
            <label>注释文件 annofile（路径）</label>
            <input v-model="sbayess.annofile" type="text" placeholder="/path/to/annot.txt" required />
          </div>
          <div>
            <label>LD 基目录 ldref</label>
            <input v-model="sbayess.ldref" type="text" placeholder="/path/to/ldref_dir" required />
            <div class="small">自动拼：ukb50k_shrunk_chr{CHR}_mafpt01.ldm.sparse</div>
          </div>
          <div>
            <label>输出目录 outdir</label>
            <input v-model="sbayess.outdir" type="text" value="./outputs" required />
          </div>
          <div>
            <label>输出前缀 outprx</label>
            <input v-model="sbayess.outprx" type="text" value="trait" required />
          </div>
          <div>
            <label>染色体列表</label>
            <input v-model="sbayess.chrs" type="text" value="1-22" required />
          </div>
          <div>
            <label>线程数</label>
            <input v-model="sbayess.threads" type="number" min="1" value="10" />
          </div>
        </div>
        <p><button type="submit">运行 SBayesS</button></p>
      </form>
    </div>

    <!-- ② make-ldm-eigen + GWFM -->
    <div class="card">
      <h2>② 先匹配 LDM→生成 eigen→GWFM(RC)</h2>
      <form @submit.prevent="submitForm('run_gwfm', gwfm)">
        <div class="row">
          <div>
            <label>GWAS summary（.ma）</label>
            <input type="file" @change="onFileChange($event, 'gwfm')" required />
          </div>
          <div>
            <label>Full LDM（路径）</label>
            <input v-model="gwfm.ldm_full" type="text" placeholder="ukbEUR_13M_FullLDM" required />
          </div>
          <div>
            <label>eigen 输出前缀</label>
            <input v-model="gwfm.eigen_out" type="text" value="matchedldm" required />
          </div>
          <div>
            <label>注释 annot（路径）</label>
            <input v-model="gwfm.annot" type="text" placeholder="/path/to/annot.txt" required />
          </div>
          <div>
            <label>gene-map（路径）</label>
            <input v-model="gwfm.genemap" type="text" placeholder="/path/to/genemap.txt" required />
          </div>
          <div>
            <label>GWFM 输出前缀</label>
            <input v-model="gwfm.out_gwfm" type="text" value="gwfm_out" required />
          </div>
          <div>
            <label>线程数</label>
            <input v-model="gwfm.threads" type="number" min="1" value="10" />
          </div>
        </div>
        <p><button type="submit">运行 make-ldm-eigen + GWFM(RC)</button></p>
      </form>
    </div>

    <!-- ③ impute-summary + SBayesRC -->
    <div class="card">
      <h2>③ impute-summary + SBayesRC</h2>
      <form @submit.prevent="submitForm('run_rc', rc)">
        <div class="row">
          <div>
            <label>GWAS summary（.ma）</label>
            <input type="file" @change="onFileChange($event, 'rc')" required />
          </div>
          <div>
            <label>ldm-eigen（目录/前缀）</label>
            <input v-model="rc.ldm_eigen" type="text" placeholder="/path/to/ldm_eigen_dir" required />
          </div>
          <div>
            <label>注释 annot（路径）</label>
            <input v-model="rc.annot" type="text" placeholder="/path/to/annot.txt" required />
          </div>
          <div>
            <label>输出前缀 out_rc</label>
            <input v-model="rc.out_rc" type="text" value="rc_out" required />
          </div>
          <div>
            <label>线程数</label>
            <input v-model="rc.threads" type="number" min="1" value="10" />
          </div>
        </div>
        <p><button type="submit">运行 impute-summary + SBayesRC</button></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GctbRunner",
  data() {
    return {
      sbayess: { annofile: "", ldref: "", outdir: "./outputs", outprx: "trait", chrs: "1-22", threads: 10, file: null },
      gwfm: { ldm_full: "", eigen_out: "matchedldm", annot: "", genemap: "", out_gwfm: "gwfm_out", threads: 10, file: null },
      rc: { ldm_eigen: "", annot: "", out_rc: "rc_out", threads: 10, file: null },
    };
  },
  methods: {
    onFileChange(event, formKey) {
      this[formKey].file = event.target.files[0];
    },
    async submitForm(api, formDataObj) {
      const formData = new FormData();
      if (formDataObj.file) formData.append("gwas", formDataObj.file);
      for (const [k, v] of Object.entries(formDataObj)) {
        if (k !== "file") formData.append(k, v);
      }
      try {
        const res = await axios.post(`http://localhost:8000/${api}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "text"
        });
        // 新窗口展示后端返回的 HTML 结果
        const win = window.open();
        win.document.write(res.data);
        win.document.close();
      } catch (err) {
        console.error("提交失败:", err);
        alert("任务提交失败！");
      }
    },
  },
};
</script>



<style scoped>
body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background: linear-gradient(120deg, #f6f7fb 60%, #e9e6f7 100%);
  padding: 32px;
}
.wrap {
  max-width: 1100px;
  margin: 32px auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}
.card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(80,80,160,0.10), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 32px 28px 28px 28px;
  transition: box-shadow 0.2s, transform 0.2s;
  border: 1.5px solid #f0f0f7;
}
.card:hover {
  box-shadow: 0 12px 40px rgba(80,80,160,0.16), 0 2px 8px rgba(0,0,0,0.06);
  transform: translateY(-2px) scale(1.01);
}
h2 {
  margin: 0 0 14px;
  font-size: 1.35rem;
  color: #0b6cff;
  letter-spacing: 1px;
  font-weight: bold;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 24px;
  margin-bottom: 8px;
}
label {
  font-weight: 600;
  color: #3a3a4a;
  margin-bottom: 4px;
  display: block;
}
input[type="text"], input[type="number"] {
  width: 100%;
  padding: 9px 12px;
  border: 1.5px solid #d6d6e7;
  border-radius: 8px;
  font-size: 1rem;
  background: #fafaff;
  transition: border 0.2s, box-shadow 0.2s;
  margin-bottom: 2px;
}
input[type="text"]:focus, input[type="number"]:focus {
  border: 1.5px solid #0b6cff;
  box-shadow: 0 0 0 2px #e0eaff;
  outline: none;
}
input[type="file"] {
  border: 1.5px dashed #bbb;
  padding: 9px 12px;
  border-radius: 8px;
  background: #f5f6fa;
  font-size: 1rem;
  margin-bottom: 2px;
}
button {
  background: linear-gradient(90deg, #0b6cff 60%, #5a8fff 100%);
  color: #fff;
  padding: 12px 0;
  border: 0;
  border-radius: 10px;
  font-size: 1.08rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 2px 8px rgba(11,108,255,0.08);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
}
button:hover {
  background: linear-gradient(90deg, #0a5ed7 60%, #3a6fd7 100%);
  box-shadow: 0 4px 16px rgba(11,108,255,0.13);
  transform: translateY(-1px) scale(1.01);
}
.small {
  color: #888;
  font-size: 12px;
  margin-top: 2px;
}
hr {
  border: none;
  border-top: 1.5px solid #eee;
  margin: 16px 0 12px 0;
}
</style>
