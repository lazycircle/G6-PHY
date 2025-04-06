<template>  
    <div class="contact-view">  
      <NavbarView />
      <h1>联系我们</h1>  
      <div class="contact-info">  
        <p>邮箱：psyconsulting@example.com</p>  
        <p>电话：123-456-7890</p>  
        <p>地址：北京市海淀区中关村科技园</p>  
      </div>  
  
      <div class="application-guide">  
        <h2>申请成为心理咨询师</h2>  
        <ol>  
          <li>发送邮件至：psyconsulting@example.com</li>  
          <li>邮件标题格式：申请心理咨询师 - 您的姓名</li>  
          <li>附件中包含以下材料：  
            <ul>  
              <li>心理咨询师资格证书</li>  
              <li>身份证复印件</li>  
              <li>其他相关资质材料</li>  
            </ul>  
          </li>  
          <li>管理员审核通过后，我们将通过邮件发送心理咨询师账号信息</li>  
        </ol>  
      </div>  
  
      
      <div class="tips">  
        <p>提示：请确保附件格式为PDF或Word文档，且文件大小不超过5MB。</p>  
      </div>  
    </div>  
  </template>  
  
  <script>
import NavbarView from '@/components/Layout/NavbarView.vue';

  
  export default { 
    name: 'ContactView',
    components: {
    NavbarView,
  },
    data() {  
      return {  
        email: '',  
        subject: '',  
        message: '',  
        files: []  
      }  
    },  
    methods: {  
      submitApplication() {  
        // 这里处理表单提交逻辑  
        // 可以使用JavaScript发送邮件或者调用后端API  
        alert('申请提交成功，我们会尽快处理！');  
      }  
    }  
  }  
  </script>  
  
<style scoped>  
.contact-view {  
  min-height: 100vh;
  background: #f5f5f5;
} 

.contact-view .content {  
  max-width: 1200px;  
  margin: 0 auto;  
    
}  


.contact-header {  
  margin-bottom: 2rem;  
}  

.contact-header h1 {  
  font-size: 2rem;  
  color: #333;  
  margin-bottom: 1rem;  
}  

.contact-info {  
  background: white;  
  padding: 2rem;  
  border-radius: 8px;  
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  margin-bottom: 2rem;  
}  

.application-guide {  
  background: white;  
  padding: 2rem;  
  border-radius: 8px;  
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
  margin-bottom: 2rem;  
}  

.application-guide h2 {  
  font-size: 1.5rem;  
  color: #333;  
  margin-bottom: 1rem;  
}  

.application-guide ol {  
  list-style-type: decimal;  
  padding-left: 20px;  
}  

.application-guide ol li {  
  margin-bottom: 0.5rem;  
  color: #666;  
}  

.application-form {  
  background: white;  
  padding: 2rem;  
  border-radius: 8px;  
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  
}  

.form-group {  
  margin-bottom: 1.5rem;  
}  

.form-group label {  
  display: block;  
  margin-bottom: 0.5rem;  
  color: #333;  
}  

.form-group input,  
.form-group textarea {  
  width: 100%;  
  padding: 0.75rem;  
  border: 1px solid #ddd;  
  border-radius: 4px;  
  font-size: 1rem;  
}  

.form-group textarea {  
  resize: vertical;  
  min-height: 100px;  
}  

button[type="submit"] {  
  background: #4a90e2;  
  color: white;  
  padding: 0.75rem 2rem;  
  border: none;  
  border-radius: 4px;  
  cursor: pointer;  
  font-size: 1rem;  
  transition: background-color 0.3s ease;  
}  

button[type="submit"]:hover {  
  background: #357abd;  
}  

.tips {  
  color: #666;  
  margin-top: 2rem;  
  font-size: 0.9rem;  
}  
</style>   