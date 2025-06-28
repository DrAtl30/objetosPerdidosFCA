export function crearSlider(wrapper) {
  const btnLeft = wrapper.querySelector(".btn-left");
  const btnRight = wrapper.querySelector(".btn-right");
  const slider = wrapper.querySelector(".carruseles");
  const sliderSections = wrapper.querySelectorAll(".slider-section");

  let counter = 0;
  const total = sliderSections.length;
  const widthImg = 100 / total;

  slider.style.width = `${100 * total}%`;
  sliderSections.forEach((section) => {
    section.style.width = `${widthImg}%`;
  });

  let operacion = 0;

  function moveToRight() {
    if (counter >= total - 1) {
      counter = 0;
      operacion = 0;
      slider.style.transform = `translateX(-${operacion}%)`;
      slider.style.transition = "none";
      return;
    }
    counter++;
    operacion = widthImg * counter;
    slider.style.transform = `translateX(-${operacion}%)`;
    slider.style.transition = "all ease .6s";
  }

  function moveToLeft() {
    if (counter <= 0) {
      counter = total - 1;
      operacion = widthImg * counter;
      slider.style.transform = `translateX(-${operacion}%)`;
      slider.style.transition = "none";
      return;
    }
    counter--;
    operacion = widthImg * counter;
    slider.style.transform = `translateX(-${operacion}%)`;
    slider.style.transition = "all ease .6s";
  }

  btnLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    moveToLeft();
    
  });

  btnRight.addEventListener("click", (e) => {
    e.stopPropagation();
    moveToRight();
    
  });
}
