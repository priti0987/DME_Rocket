const fs = require('fs');
const path = require('path');

// Post-process the generated HTML report to customize Dashboard heading
function postProcessReport() {
  const reportPath = path.join('reports', 'html', 'index.html');
  
  if (!fs.existsSync(reportPath)) {
    console.log('Report file not found, skipping post-processing');
    return;
  }
  
  try {
    let htmlContent = fs.readFileSync(reportPath, 'utf-8');
    
    // Replace Dashboard with QA Dashboard
    htmlContent = htmlContent.replace(
      '<p class="navbar-text" style="float: left">Dashboard</p>',
      '<p class="navbar-text" style="float: left">QA Dashboard</p>'
    );
    
    // Write the updated content back
    fs.writeFileSync(reportPath, htmlContent, 'utf-8');
    console.log('Report post-processed: Dashboard → QA Dashboard');
    
  } catch (error) {
    console.error('Error post-processing report:', error.message);
  }
}

postProcessReport();
