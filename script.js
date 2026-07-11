const HOLIDU_URL = "https://villa-delrelax.vacation-bookings.com/";
const galleryPhotos = [
  {src:"images/hero.jpg", cat:"piscina", key:"gHero"},
  {src:"images/piscina1.jpg", cat:"piscina", key:"gPoolDay"},
  {src:"images/piscina2.jpg", cat:"piscina", key:"gGarden"},
  {src:"images/piscina_noche.jpg", cat:"piscina", key:"gPoolNight"},
  {src:"images/terraza_atardecer.jpg", cat:"exterior", key:"gTerraceSunset"},
  {src:"images/exterior_sofa.jpg", cat:"exterior", key:"gSofa"},
  {src:"images/barbacoa.jpg", cat:"exterior", key:"gBarbecue"},
  {src:"images/entrada.jpg", cat:"exterior", key:"gEntrance"},
  {src:"images/salon.jpg", cat:"interior", key:"gLiving"},
  {src:"images/cocina.jpg", cat:"interior", key:"gKitchen"},
  {src:"images/dormitorio_principal.jpg", cat:"dormitorios", key:"gMaster"},
  {src:"images/dormitorio_doble.jpg", cat:"dormitorios", key:"gDouble"},
  {src:"images/dormitorio_familiar.jpg", cat:"dormitorios", key:"gFamily"},
  {src:"images/bano1.jpg", cat:"banos", key:"gBath1"},
  {src:"images/bano2.jpg", cat:"banos", key:"gBath2"},
  {src:"images/pingpong.jpg", cat:"ocio", key:"gPingpong"}
];

let currentLang = localStorage.getItem("lang") || "es";
let currentPhoto = 0;
let currentFilter = "all";

function t(key){
  return (window.translations?.[currentLang]?.[key]) || (window.translations?.es?.[key]) || key;
}

function changeLanguage(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(t(key)) el.textContent = t(key);
  });
  document.getElementById("languageSelect").value = lang;
  renderGalleryFilters();
  updateGallery();
}

function filteredPhotos(){
  if(currentFilter === "all") return galleryPhotos;
  return galleryPhotos.filter(p => p.cat === currentFilter);
}

function renderGalleryFilters(){
  const filters = [
    ["all","filterAll"],
    ["piscina","filterPool"],
    ["exterior","filterExterior"],
    ["interior","filterInterior"],
    ["dormitorios","filterBedrooms"],
    ["banos","filterBathrooms"],
    ["ocio","filterLeisure"]
  ];
  const box = document.getElementById("galleryFilters");
  if(!box) return;
  box.innerHTML = "";
  filters.forEach(([id,key])=>{
    const btn = document.createElement("button");
    btn.textContent = t(key);
    btn.className = currentFilter === id ? "active" : "";
    btn.onclick = () => {
      currentFilter = id;
      currentPhoto = 0;
      renderGalleryFilters();
      updateGallery();
    };
    box.appendChild(btn);
  });
}

function updateGallery(){
  const photos = filteredPhotos();
  if(!photos.length) return;
  if(currentPhoto >= photos.length) currentPhoto = 0;
  const photo = photos[currentPhoto];

  const main = document.getElementById("mainGalleryImage");
  const caption = document.getElementById("galleryCaption");
  const light = document.getElementById("lightboxImage");
  const counter = document.getElementById("lightboxCounter");

  if(main){ main.src = photo.src; main.alt = t(photo.key); }
  if(light){ light.src = photo.src; light.alt = t(photo.key); }
  if(caption){ caption.textContent = t(photo.key); }
  if(counter){ counter.textContent = `${currentPhoto + 1} / ${photos.length}`; }

  const thumbs = document.getElementById("galleryThumbs");
  if(thumbs){
    thumbs.innerHTML = "";
    photos.forEach((p,i)=>{
      const img = document.createElement("img");
      img.src = p.src;
      img.alt = t(p.key);
      img.className = i === currentPhoto ? "active" : "";
      img.onclick = () => { currentPhoto = i; updateGallery(); };
      thumbs.appendChild(img);
    });
  }
}

function nextPhoto(){
  const photos = filteredPhotos();
  currentPhoto = (currentPhoto + 1) % photos.length;
  updateGallery();
}
function prevPhoto(){
  const photos = filteredPhotos();
  currentPhoto = (currentPhoto - 1 + photos.length) % photos.length;
  updateGallery();
}

function openLightbox(){
  document.getElementById("lightbox").style.display = "flex";
  updateGallery();
}
function closeLightbox(){
  document.getElementById("lightbox").style.display = "none";
}

function openAvailability(){
  document.getElementById("availabilityPopup").style.display = "flex";
}
function closeAvailability(){
  document.getElementById("availabilityPopup").style.display = "none";
}
function goToHolidu(){
  window.location.href = HOLIDU_URL;
}

function acceptCookies(){
  localStorage.setItem("cookies","accepted");
  document.getElementById("cookiesBanner").style.display = "none";
}
function rejectCookies(){
  localStorage.setItem("cookies","rejected");
  document.getElementById("cookiesBanner").style.display = "none";
}
function configureCookies(){
  alert(t("cookiesConfigAlert"));
}

function toggleMobileMenu(){
  document.getElementById("mainNav").classList.toggle("open");
}

document.addEventListener("keydown", e=>{
  if(e.key === "Escape"){ closeLightbox(); closeAvailability(); }
  if(document.getElementById("lightbox").style.display === "flex"){
    if(e.key === "ArrowRight") nextPhoto();
    if(e.key === "ArrowLeft") prevPhoto();
  }
});

document.addEventListener("click", e=>{
  const nav = document.getElementById("mainNav");
  if(e.target.closest(".nav a")){
    nav.classList.remove("open");
  }
});

document.addEventListener("DOMContentLoaded", ()=>{
  if(!localStorage.getItem("cookies")){
    document.getElementById("cookiesBanner").style.display = "block";
  }
  renderGalleryFilters();
  updateGallery();
  changeLanguage(currentLang);
});
