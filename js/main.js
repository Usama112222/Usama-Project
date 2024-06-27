(function ($) {
  "use strict";
  const pathname = window.location.pathname;

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $(".navbar").addClass("sticky-top shadow-sm");
    } else {
      $(".navbar").removeClass("sticky-top shadow-sm");
    }
  });

  // Dropdown on mouse hover
  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function () {
    if (this.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function () {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function () {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    margin: 24,
    dots: true,
    loop: true,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const offsetTop = document.querySelector(
        this.getAttribute("href")
      ).offsetTop;
      const headerOffset = 50; // Height of your fixed header
      window.scrollTo({
        top: offsetTop - headerOffset, // Subtract header height to adjust for fixed header
        behavior: "smooth",
      });
    });
  });

  var currentTrips = 0;
  const tripsToShowEachTime = 3;
  let tripsData = [];

  function createTripCards(trips) {
    var container = document.getElementById("tripContainer");
    container.innerHTML = ""; // Clear existing content

    trips.forEach(function (trip, index) {
      if (index < currentTrips) {
        // Column div
        var colDiv = document.createElement("div");
        colDiv.className = "col-lg-4 col-md-6 wow fadeInUp";
        colDiv.setAttribute("data-wow-delay", "0.1s");

        // Package item div
        var packageDiv = document.createElement("div");
        packageDiv.className = "package-item";

        // Image container
        var imgContainer = document.createElement("div");
        imgContainer.className = "overflow-hidden";
        var img = document.createElement("img");
        img.className = "trip-card-image";
        img.src = trip.imagePath.replace('public\\uploads\\', 'http://localhost:100/uploads/');
        img.alt = trip.name;
        imgContainer.appendChild(img);

        // Info container
        var infoDiv = document.createElement("div");
        infoDiv.className = "d-flex border-bottom";

        var locationSpan = document.createElement("small");
        locationSpan.className = "flex-fill text-center border-end py-2";
        locationSpan.innerHTML = `<i class="fa fa-map-marker-alt text-primary me-2"></i>${trip.location}`;

        var durationSpan = document.createElement("small");
        durationSpan.className = "flex-fill text-center border-end py-2";
        durationSpan.innerHTML = `<i class="fa fa-calendar-alt text-primary me-2"></i>${trip.duration} days`;

        // var personsSpan = document.createElement("small");
        // personsSpan.className = "flex-fill text-center py-2";
        // personsSpan.innerHTML = `<i class="fa fa-university  text-primary me-2"></i>${trip.name}`;

        infoDiv.appendChild(locationSpan);
        infoDiv.appendChild(durationSpan);
        // infoDiv.appendChild(personsSpan);

        // Description and button container
        var descDiv = document.createElement("div");
        descDiv.className = "text-center p-4";

        var priceH3 = document.createElement("h3");
        priceH3.className = "mb-0";
        priceH3.textContent = `PKR ${trip.price.toFixed(2)}`;
        var descP = document.createElement("p");
        descP.textContent = trip.description;

        var buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex justify-content-center mb-2";

        var weatherButton = document.createElement("button");
        weatherButton.className = "btn btn-sm btn-primary px-3 border-end";
        weatherButton.textContent = "Check Weather";
        weatherButton.onclick = function () {
          checkWeather(trip.location, index);
        };

        var bookButton = document.createElement("a");
        var isLoggedIn = localStorage.getItem("isLoggedIn");

        if (isLoggedIn === "true") {
          // If logged in, navigate to the booking section
          bookButton.href = "#booking";
        } else {
          // If not logged in, navigate to the login page
          bookButton.href = "/login.html"; // Update this with the actual path to your login page
        }
        bookButton.className = "btn btn-sm btn-primary px-3";
        bookButton.textContent = "Book Now";

        buttonContainer.appendChild(weatherButton);
        buttonContainer.appendChild(bookButton);

        // Append all parts to the package item
        packageDiv.appendChild(imgContainer);
        packageDiv.appendChild(infoDiv);
        descDiv.appendChild(priceH3);
        descDiv.appendChild(descP);
        descDiv.appendChild(buttonContainer);
        packageDiv.appendChild(descDiv);

        // Append the package item to the column div
        colDiv.appendChild(packageDiv);

        // Append the column div to the container
        container.appendChild(colDiv);
      }
    });

    updateShowMoreButton(trips); // Update the Show More button visibility
  }

  function fetchWeather(location) {
    const apiKey = "8026683f4a92594cb95b44eba6b80af4"; // Replace with your OpenWeatherMap API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod && data.cod !== 200) {
          showToast(`Error: ${data.message}`);
        } else {
          displayWeather(data); // Function to display weather data in your modal
        }
      })
      .catch((error) => {
        showToast(`Error: ${error.message}`); // Function to display error in toast
        console.error("Error:", error.message);
      });
  }

  function displayWeather(data) {
    // Assuming you have a modal element to show the weather
    const weatherModal = document.getElementById("weatherModalContent"); // Ensure you have a div with this id in your modal for content
    const weatherContent = `
        <div class="weather-modal-header">
            <h5 class="weather-modal-title">Weather in ${data.name}</h5>
        </div>
        <div class="weather-modal-body">
            <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
            <p><strong>Weather:</strong> ${data.weather[0].main}</p>
            <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        </div>
    `;

    weatherModal.innerHTML = weatherContent;
    $("#weatherModal").modal("show");
  }

  function showToast(message) {
    const weatherToast = new bootstrap.Toast(
      document.getElementById("weatherToast")
    );
    document.querySelector("#weatherToast .toast-body").textContent = message;
    weatherToast.show();
  }

  function checkWeather(location, index) {
    // Here you would fetch the weather data based on the location
    // For demo purposes, I'm just showing a static message
    fetchWeather(location);
    // Show the modal (assuming you are using Bootstrap's modal)
    // $('#weatherModal').modal('show');
  }
  function showMoreTrips() {
    currentTrips += tripsToShowEachTime;
    createTripCards(tripsData); // Assuming dummyTrips is your data array
  }

  // Function to update the visibility of the Show More button
  function updateShowMoreButton(trips) {
    var showMoreBtn = document.getElementById("showMoreBtn");
    if (currentTrips < trips.length) {
      showMoreBtn.style.display = "block"; // Show the button
    } else {
      showMoreBtn.style.display = "none"; // Hide the button if no more trips are available
    }
  }

  // Example array of testimonials
  let testimonials = [];
  // Function to render testimonials dynamically on the page
  function renderTestimonials(testimonialsArray) {
    const testimonialContainer = document.querySelector(".testimonial-carousel");
    testimonialContainer.innerHTML = ""; // Clear existing testimonials

    testimonialsArray.forEach((testimonial) => {
      const testimonialElement = document.createElement("div");
      testimonialElement.className = "testimonial-item bg-white text-center border p-4";
      const imagePath = testimonial.imagePath.replace('public\\uploads\\', 'http://localhost:100/uploads/');

      testimonialElement.innerHTML = `
            <img class="bg-white rounded-circle shadow p-1 mx-auto mb-3" src="${imagePath}" alt="Testimonial from ${testimonial.name}" style="width: 80px; height: 80px;">
            <h5 class="mb-0">${testimonial.name}</h5>
            <p class="text-muted">${testimonial.address}</p>
            <p class="mb-0 testimonial-text">${testimonial.reviewText}</p>
        `;
      testimonialContainer.appendChild(testimonialElement);
    });

    // Now that dynamic content has been added, initialize the carousel
    initializeCarousel();
  }


  function initializeCarousel() {
    // Check if the carousel was already initialized and destroy it
    if ($(".testimonial-carousel").data("owl.carousel")) {
      $(".testimonial-carousel").data("owl.carousel").destroy();
    }

    // Reinitialize the carousel
    $(".testimonial-carousel").owlCarousel({
      center: true,
      loop: true,
      margin: 24,
      autoplay: true,
      autoplayTimeout: 3000, // Set the timeout to 3 seconds
      autoplayHoverPause: true, // Pause on hover
      responsive: {
        600: {
          items: 3,
        },
      },
    });

    // Update the active class after initialization and on change
    updateActiveClass();
    $(".testimonial-carousel").on("changed.owl.carousel", updateActiveClass);
  }

  function updateActiveClass() {
    // You might need to adjust the selector based on the version of Owl Carousel
    $(".owl-item.active").siblings().removeClass("active");
    $(".owl-item.active").eq(1).addClass("active"); // Since the center item is the second active item in the array
  }
  // if (!pathname.endsWith('pages/trip.html')) {

  document.addEventListener("DOMContentLoaded", function () {
    if (!pathname.endsWith('pages/trip.html')) {
      renderTestimonials(testimonials);
    }
    var logoutButton = document.getElementById("logoutButton");

    // Only add the event listener if the logoutButton exists
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        // Remove the token from local storage
        localStorage.clear();
        // Redirect the user to index.html
        window.location.href = "../index.html";
      });
    }
  });
  // }
  //============api to get trips===================

  function fetchTrips() {
    fetch('http://localhost:100/api/trip', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        const destinationsDropdown = document.getElementById('select1');
        tripsData = responseData.data;
        const pathname = window.location.pathname;

        // Clear existing options
        if (pathname.match(/home\.html$/)) {
          destinationsDropdown.innerHTML = '';
          // Populate dropdown with trips
          tripsData.forEach(trip => {
            const option = document.createElement('option');
            option.value = trip.id; // Use trip ID as value
            option.textContent = trip.location; // Use trip location as label
            destinationsDropdown.appendChild(option);
          });
        }
        if (!pathname.endsWith('pages/trip.html')) {
          createTripCards(tripsData);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  //============api to get reviews===================
  function fetchReviews() {
    fetch('http://localhost:100/api/review', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('response.data-====>', responseData)
        testimonials = responseData
        if (!pathname.endsWith('pages/trip.html')) {
          renderTestimonials(testimonials)
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  //============trip booking api======================
  // Clear existing options
  if (pathname.match(/home\.html$/)) {
    document.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();

      // Assuming 'form' is the form you're submitting, define it correctly
      var form = e.target;

      const selectedTripId = document.getElementById('select1').value;
      const selectedTrip = tripsData.find(trip => trip.id === selectedTripId);

      const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        date: document.getElementById('datetime').value,
        tripId: selectedTripId,
        location: selectedTrip ? selectedTrip.location : null, // Include location
      };

      fetch('http://localhost:100/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Booking successful:', data);
          form.reset();
          alert("Booking successful")
          // Handle success
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle errors
        });
    });
  }

  //================submiting review api=============
  // Clear existing options
  if (pathname.match(/home\.html$/)) {
    const form = document.getElementById('testimonialForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the default form submission
      const formData = new FormData();
      formData.append('name', document.getElementById('testimonialName').value);
      formData.append('reviewText', document.getElementById('testimonialText').value);
      formData.append('address', document.getElementById('testimonialLocation').value);

      // Add file to FormData if it's selected
      const imageInput = document.getElementById('testimonialImage');
      if (imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }
      // Create FormData object from the form
      const apiUrl = 'http://localhost:100/api/review'; // Update with your actual endpoint

      fetch(apiUrl, {
        method: 'POST',
        body: formData, // Send the form data
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          alert("review submitted successfully")

          form.reset();
          fetchReviews()
          initializeCarousel();
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle errors here (e.g., showing an error message)
        });
    });
  }

  function filterTrips(searchQuery) {
    const filteredTrips = tripsData.filter((trip) =>
      trip.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    createTripCards(filteredTrips);
  }

  if (pathname.match(/home\.html$/) || pathname.match(/index\.html$/) || pathname.match(/dashboard\.html$/)) {
    document.getElementById("searchButton").addEventListener("click", () => {
      const searchQuery = document.getElementById("searchInput").value;
      filterTrips(searchQuery);
    });
  }
  $(document).ready(function () {
    // Existing code ...

    // Fetch and display trips
    fetchTrips();
    fetchReviews()
  });

  if (!pathname.endsWith('pages/trip.html')) {
    document
      .getElementById("showMoreBtn")
      .addEventListener("click", showMoreTrips);
  }
  // document.addEventListener('DOMContentLoaded', function () {
  //   // Fetch and display trips
  //   fetchTrips();
  //   fetchReviews()
  // })
  // Initial load
  if (!pathname.endsWith('pages/trip.html')) {

    $(document).ready(function () {
      currentTrips = tripsToShowEachTime;
      createTripCards(tripsData);
    });
  }
})(jQuery);



//     function createTripCards(trips) {
//     var tripContainer = $('#trips .row');

//     trips.forEach(function(trip) {
//         var tripCardHtml = `
//             <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
//                 <div class="package-item">
//                     <div class="overflow-hidden">
//                         <img class="img-fluid" src="${trip.image}" alt="">
//                     </div>
//                     <div class="d-flex border-bottom">
//                         <small class="flex-fill text-center border-end py-2"><i class="fa fa-map-marker-alt text-primary me-2"></i>${trip.location}</small>
//                         <small class="flex-fill text-center border-end py-2"><i class="fa fa-calendar-alt text-primary me-2"></i>${trip.duration} days</small>
//                         <small class="flex-fill text-center py-2"><i class="fa fa-user text-primary me-2"></i>${trip.persons} Person</small>
//                     </div>
//                     <div class="text-center p-4">
//                         <h3 class="mb-0">$${trip.price}</h3>
//                         <p>${trip.description}</p>
//                         <div class="d-flex justify-content-center mb-2">
//                             <a href="#" class="btn btn-sm btn-primary px-3 border-end" style="border-radius: 30px 0 0 30px;">Read More</a>
//                             <a href="#" class="btn btn-sm btn-primary px-3" style="border-radius: 0 30px 30px 0;">Book Now</a>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;

//         tripContainer.append(tripCardHtml);
//     });
// }
// function createTripCards(trips) {
//     var container = document.getElementById('tripContainer');
//     container.innerHTML = ''; // Clear existing content

//     for (var i = 0; i < currentTrips && i < trips.length; i++) {
//         var trip = trips[i];
// var cardHtml = `
//     <div class="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
//         <div class="package-item">
//             <div class="overflow-hidden">
//                 <img class="img-fluid" src="${trip.image}" alt="${trip.name}">
//             </div>
//             <div class="d-flex border-bottom">
//                 <small class="flex-fill text-center border-end py-2">
//                     <i class="fa fa-map-marker-alt text-primary me-2"></i>${trip.location}
//                 </small>
//                 <small class="flex-fill text-center border-end py-2">
//                     <i class="fa fa-calendar-alt text-primary me-2"></i>${trip.duration} days
//                 </small>
//                 <small class="flex-fill text-center py-2">
//                     <i class="fa fa-user text-primary me-2"></i>${trip.persons} Person
//                 </small>
//             </div>
//             <div class="text-center p-4">
//                 <h3 class="mb-0">$${trip.price.toFixed(2)}</h3>
//                 <p>${trip.description}</p>
//                 <div class="d-flex justify-content-center mb-2">
//                     <a href="#" class="btn btn-sm btn-primary px-3 border-end">Check Weater</a>
//                     <a href="#" class="btn btn-sm btn-primary px-3">Book Now</a>
//                 </div>
//             </div>
//         </div>
//     </div>
// `;
//         container.innerHTML += cardHtml;
//     }
//      updateShowMoreButton(trips); // Update the Show More button visibility
//     }