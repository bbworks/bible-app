const toggleMobileNav = function(event) {
  //Declare variables
  const toggle = event.target;
  const nav = toggle.parentNode;

  const toggleClosedClass = /*fas*/ "fa-bars";
  const toggleOpenClass = /*fas*/ "fa-times";

  //Toggle the "responsive" class on the navigation
  nav.classList.toggle("responsive");

  //Toggle the icon on the toggle
  if (nav.classList.contains("responsive")) {
    toggle.classList.remove(toggleClosedClass);
    toggle.classList.add(toggleOpenClass);
  }
  else {
    toggle.classList.remove(toggleOpenClass);
    toggle.classList.add(toggleClosedClass);
  }
};
