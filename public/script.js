document.addEventListener("DOMContentLoaded", () => {
  const homeLink = document.getElementById("home-link");
  const universityListLink = document.getElementById("university-list-link");
  const pageTitle = document.getElementById("page-title");
  const mainContent = document.getElementById("main-content");
  const universityListContent = document.getElementById(
    "university-list-content"
  );
  const paginationContainer = document.getElementById("pagination");
  const breadcrumbUniversityList = document.getElementById(
    "breadcrumb-university-list"
  );
  const websiteInfoLink = document.getElementById("Website-info-link")
  const websiteInfoContent = document.getElementById("website-info-content")
  const breadcrumbWebsiteInfo = document.getElementById("breadcrumb-website-info")
  fetch("/universities")
    .then((response) => response.json())
    .then((data) => {
      const universityList = document.getElementById("university-list");

      const showUniversityList = (page) => {
        universityList.innerHTML = "";
        const startIndex = (page - 1) * 10;
        const endIndex = page * 10;
        const universities = data.slice(startIndex, endIndex);

        universities.forEach((university) => {
          const tableRow = document.createElement("tr");

          const nameCell = document.createElement("td");
          nameCell.textContent = university.name;
          tableRow.appendChild(nameCell);

          const countryCell = document.createElement("td");
          countryCell.textContent = university.country;
          tableRow.appendChild(countryCell);

          const stateProvinceCell = document.createElement("td");
          stateProvinceCell.textContent = university["state-province"] || "N/A";
          tableRow.appendChild(stateProvinceCell);

          const webPagesCell = document.createElement("td");
          webPagesCell.textContent = university.web_pages.join(", ");
          tableRow.appendChild(webPagesCell);

          const domainsCell = document.createElement("td");
          domainsCell.textContent = university.domains.join(", ");
          tableRow.appendChild(domainsCell);

          const alphaTwoCodeCell = document.createElement("td");
          alphaTwoCodeCell.textContent = university.alpha_two_code;
          tableRow.appendChild(alphaTwoCodeCell);

          universityList.appendChild(tableRow);
        });
      };

      const totalPages = Math.ceil(data.length / 10);
      for (let page = 1; page <= totalPages; page++) {
        const paginationItem = document.createElement("li");
        paginationItem.classList.add("page-item");
        const paginationLink = document.createElement("a");
        paginationLink.classList.add("page-link");
        paginationLink.href = "#";
        paginationLink.textContent = page;
        paginationLink.addEventListener("click", () => {
          showUniversityList(page);
        });
        paginationItem.appendChild(paginationLink);
        paginationContainer.appendChild(paginationItem);
      }

      // Set the first page as default if "University List" link is clicked
      universityListLink.addEventListener("click", () => {
        showUniversityList(1);
      });
    })
    .catch((error) => {
      console.error("Error fetching university data:", error.message);
    });

  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    pageTitle.textContent = "Home";
    mainContent.style.display = "block";
    universityListContent.style.display = "none";
    breadcrumbUniversityList.style.display = "none";
    paginationContainer.innerHTML = "";
    websiteInfoContent.style.display = "none";
    breadcrumbWebsiteInfo.style.display = "none";
  });

  universityListLink.addEventListener("click", (event) => {
    event.preventDefault();
    pageTitle.textContent = "University List";
    mainContent.style.display = "none";
    universityListContent.style.display = "block";
    breadcrumbUniversityList.style.display = "block";
    websiteInfoContent.style.display = "none";
    breadcrumbWebsiteInfo.style.display = "none";
    //   showUniversityList(1);
  });
  websiteInfoLink.addEventListener("click", (event) => {
    event.preventDefault();
    pageTitle.textContent = "About Website";
    mainContent.style.display = "none";
    universityListContent.style.display = "none";
    breadcrumbUniversityList.style.display = "none";
    websiteInfoContent.style.display = "block";
    breadcrumbWebsiteInfo.style.display = "block";
    //   showUniversityList(1);
  });

  const exportButton = document.getElementById('export-button');
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      fetch('/export')
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Export failed');
          }
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'university_data.csv';
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Export error:', error);
        });
    });
  }
});
