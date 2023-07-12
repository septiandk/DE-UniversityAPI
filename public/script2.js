document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.getElementById('home-link');
    const universityListLink = document.getElementById('university-list-link');
    const pageTitle = document.getElementById('page-title');
    const mainContent = document.getElementById('main-content');
    const universityListContent = document.getElementById('university-list-content');
    const universityListIframe = document.getElementById('university-list-iframe');
    const breadcrumbUniversityList = document.getElementById('breadcrumb-university-list');
    const paginationContainer = document.getElementById('pagination');
  
    if (!homeLink || !universityListLink || !pageTitle || !mainContent || !universityListContent || !universityListIframe || !breadcrumbUniversityList || !paginationContainer) {
      console.error('Required element not found.');
      return;
    }
  
    homeLink.addEventListener('click', (event) => {
      event.preventDefault();
      pageTitle.textContent = 'Home';
      mainContent.style.display = 'block';
      universityListContent.style.display = 'none';
      universityListIframe.style.display = 'none';
      breadcrumbUniversityList.style.display = 'none';
      paginationContainer.innerHTML = '';
    });
  
    universityListLink.addEventListener('click', (event) => {
      event.preventDefault();
      pageTitle.textContent = 'University List';
      mainContent.style.display = 'none';
      universityListContent.style.display = 'block';
      universityListIframe.style.display = 'block';
      breadcrumbUniversityList.style.display = 'inline-block';
      universityListIframe.src = 'university-list.html';
    });
  
    const exportButton = document.getElementById('export-button');
    if (exportButton) {
      exportButton.addEventListener('click', () => {
        const newWindow = window.open('/export', '_blank');
        if (!newWindow) {
          // Pop-up blocked, show an error message or handle it gracefully
          console.error('Export pop-up blocked');
        } else {
          newWindow.addEventListener('load', () => {
            setTimeout(() => {
              newWindow.close();
              homeLink.click();
            }, 1000);
          });
        }
      });
    }
  });
  