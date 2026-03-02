const loadingSpinner = document.getElementById("loading-spinner");
const bordersContainer = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");
const countryInfo = document.getElementById("country-info");

async function searchCountry(countryName) {
    try {
        loadingSpinner.style.display = "block";
        bordersContainer.innerHTML = "";
        countryInfo.innerHTML = "";

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="200">
        `;

        if (country.borders) {
            for (let code of country.borders) {
                const border_response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const border_data = await border_response.json();
                const border_country = border_data[0];

                bordersContainer.innerHTML += `
                    <section class="border-country">
                        <p>${border_country.name.common}</p>
                        <img src="${border_country.flags.svg}" alt="${border_country.name.common} flag" width="100">
                    </section>
                `;
            }
        } else {
            bordersContainer.innerHTML = `<p>There are no bordering countries</p>`;
        }

    } catch (error) {
        countryInfo.innerHTML = `<p>${error.message}</p>`;
    } finally {
        loadingSpinner.style.display = "none";
    }
}

document.getElementById("search-btn").addEventListener("click", () => {
    const country = document.getElementById("country-input").value.trim();
    if (country) {
        searchCountry(country);
    }
});

document.getElementById("country-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const country = event.target.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});