import { Page } from '../modules/base_template.js';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import translationMainPage from '../localization/main_page.json';

import aboutUsQrIconSVG from '../assets/svg/main/about_us_qr.svg?raw';
import mainOption1IconSVG from '../assets/svg/main/main_option_1.svg?raw';
import mainOption2IconSVG from '../assets/svg/main/main_option_2.svg?raw';
import gradeActiveIconSVG from '../assets/svg/main/grade_active.svg?raw';
import gradeUnactiveIconSVG from '../assets/svg/main/grade_unactive.svg?raw';
import locationIconSVG from '../assets/svg/main/location_icon.svg?raw';
import appleStoreIconSVG from '../assets/svg/main/app-store.svg?raw';

export class MainPage extends Page {
    constructor(...props) {
        super(...props);

        this.translation = translationMainPage;

        this.employees2 = null;
    }

    * getEmployee () {
        for (let employe of this.employees2) {
            yield employe
        }
    }
    employees2Gen = this.getEmployee();

    employeeContainer2 = (j) => {
        let content = '';
        
        for (let i=1; i<=j; i++) {
            let employee = this.employees2Gen.next().value;
            if (!employee) {
                return {content: content, last: true};
            }

            content += `
                <div class="employee_container_2 container_2">
                    <div class="employee_container_body">
                        <img class="employee_photo" src="${employee.photo}">
                        <div class="employee_info_container">
                            <p class="w500">${employee.name}</p>
                            <p class="fz12 lh16 op05">${employee.position}</p>
                        </div>
                    </div>
                    <div class="employee_location_container">
                        ${locationIconSVG}
                        <p class="w500 op05">${employee.location}</p>
                    </div>
                    <span class="employee_status op025"></span>
                </div>
            `
        }
        return content;
    }

    async getHtml() {
        await super.getHtml();

        let reviews = [
            {name: 'Olivia', text: 'The service is excellent, everything works quickly and conveniently!', date: this.translationText()['review1Date'], photo: '/images/reviews/olivia.jpg', grade: 5},
            {name: 'George', text: 'Its good that among so many charlatans there are such companies...', date: this.translationText()['review2Date'], photo: '/images/reviews/george.jpg', grade: 5},
            {name: 'Mia', text: 'Thank you, Victoria. Has promptly gathered the information, filed an...', date: this.translationText()['review3Date'], photo: '/images/reviews/mia.jpg', grade: 5},
            {name: 'Arthur', text: 'Perfect managers which know their works, takes my money back, I’m so...', date: this.translationText()['review4Date'], photo: '/images/reviews/arthur.jpg', grade: 5},
            {name: 'Isla', text: 'My first manager was a new worker, so he can’t take me a right help, but then...', date: this.translationText()['review5Date'], photo: '/images/reviews/isla.jpg', grade: 3},
            {name: 'Muhammad', text: 'The fund returned a significant portion of my funds, prompt work!', date: this.translationText()['review6Date'], photo: '/images/reviews/muhammad.jpg', grade: 4},
        ];

        function getReviews() {
            let content = '';
            
            let gradeActive = gradeActiveIconSVG;
            let gradeUnactive = gradeUnactiveIconSVG;

            for (let review of reviews) {
                let grade = ''

                for (let i=1; i<=review.grade; i++) {
                    grade += gradeActive;
                }
                
                grade += gradeUnactive.repeat(5-review.grade);

                content += `
                    <div class="review_container container_2">
                        <div class="review_container_header">
                            <img class="review_photo" src="${review.photo}">
                            <div class="review_name fz16 lh24 w500">
                                <p>${review.name}</p>
                            </div>
                            <div class="review_date fz12 lh16 w500 op025">
                                <p>${review.date}</p>
                            </div>
                        </div>
                        <div class="review_container_grade_container">
                            ${grade}
                        </div>
                        <div class="review_container_text op05">
                            <p>${review.text}</p>
                        </div>
                    </div>
                `
            }
            return content;
        }

        let employees1 = [
            {name: this.translationText()['employee1Name'], location: this.translationText()['employeeLocation'], position: 'CEO', photo: '/images/employees/maria-zavirova.png'},
            {name: this.translationText()['employee2Name'], location: this.translationText()['employeeLocation'], position: 'CFO', photo: '/images/employees/tomas-bolton.jpg'},
            {name: this.translationText()['employee3Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeEconomist'], photo: '/images/employees/amina-abasova.jpg'},
            {name: this.translationText()['employee4Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/victoria-hromova.jpg'},
        ];
        let employeeContainer1 = () => {
            let content = '';
            for (let employee of employees1) {
                content += `
                    <div class="employee_container_1 container_2">
                        <img class="employee_photo" src="${employee.photo}">
                        <div class="employee_location_container">
                            ${locationIconSVG}
                            <p class="w500 op05">${employee.location}</p>
                        </div>
                        <div class="employee_info_container">
                            <p class="fz16 lh24 w500">${employee.name}</p>
                            <p class="fz12 lh16 op05">${employee.position}</p>
                        </div>
                        <span class="employee_status op025"></span>
                    </div>
                `
            }
            return content;
        }

        this.employees2 = [
            {name: this.translationText()['employee5Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/alena-koktush.jpg'},
            {name: this.translationText()['employee6Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/vyacheslav-parhomov.jpg'},
            {name: this.translationText()['employee7Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/andrew-michurin.jpg'},
            {name: this.translationText()['employee8Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/timur-samarin.jpg'},
            {name: this.translationText()['employee9Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/sergey-krestov.jpg'},
            {name: this.translationText()['employee10Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeePayementsDivision'], photo: '/images/employees/maxim-mintslov.jpg'},
            {name: this.translationText()['employee11Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeePayementsDivision'], photo: '/images/employees/emma-lindberg.png'},
            {name: this.translationText()['employee12Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeePayementsDivision'], photo: '/images/employees/german-titov.jpg'},
            {name: this.translationText()['employee13Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/mironenko-karina.png'},
            {name: this.translationText()['employee14Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/isaeva-olga.png'},
            {name: this.translationText()['employee15Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/yusupova-maria.png'},
            {name: this.translationText()['employee16Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/voronin-gleb.png'},
            {name: this.translationText()['employee17Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/boyko-sofia.png'},
            {name: this.translationText()['employee18Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/bondar-evgeniya.png'},
            {name: this.translationText()['employee19Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/streletskaya-marina.png'},
            {name: this.translationText()['employee20Name'], location: this.translationText()['employeeLocation'], position: this.translationText()['employeeManager'], photo: '/images/employees/kostenko-vladislav.png'},
        ];

        this.employees2Gen = this.getEmployee();

        let content = `
            <div class="main_page_section text_1">
                <p class="main_page_title fz26 lh34 w700">${this.translationText()['mainTitle']}</p>
                <div class="main_about_profile_section container_section text_1">
                    <p class="fz16 lh24 w700">${this.translationText()['profileTitle']}</p>
                    <div class="main_about_profile_container">
                        <div class="about_us_description_container container_3">
                            <div class="about_us_description_container_header fz16 lh24 w500"">${this.translationText()['profileContainerTitle']}</div>
                            <p class="op05">${this.translationText()['profileContainerText']}</p>
                        </div>
                        <div class="about_us_qr_container container_4">
                            ${aboutUsQrIconSVG}
                        </div>
                    </div>
                </div>
                <div class="main_options_section container_section">
                    <p class="fz16 lh24 w700">${this.translationText()['optionsTitle']}</p>
                    <div class="main_options_container">
                        <div class="main_option_container container_2">
                            <div class="main_option_container_header">
                                <p class="fz16 lh24 w500">${this.translationText()['optionContainer1Title']}</p>
                            </div>
                            <div class="main_option_text_container">
                                <div class="main_option_container_icon">
                                    <div class="main_option_container_icon_svg op05">
                                        ${mainOption1IconSVG}
                                    </div>
                                    <div class="main_option_container_icon_text">
                                        <p class="op05">${this.translationText()['optionContainer1Text1']}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="main_option_text_container">
                                <p class="op05">${this.translationText()['optionContainer1Text2']}</p>
                            </div>
                        </div>
                        <div class="main_option_container container_2">
                            <div class="main_option_container_header">
                                <p class="fz16 lh24 w500">${this.translationText()['optionContainer2Title']}</p>
                            </div>
                            <div class="main_option_text_container">
                                <div class="main_option_container_icon">
                                    <div class="main_option_container_icon_svg op05">
                                        ${mainOption2IconSVG}
                                    </div>
                                    <div class="main_option_container_icon_text">
                                        <p class="op05">${this.translationText()['optionContainer2Text1']}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="main_option_text_container">
                                <p class="op05">${this.translationText()['optionContainer2Text2']}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main_reviews_setcion container_section">
                    <p class="fz16 lh24 w700">${this.translationText()['reviewsTitle']}</p>
                    <div class="reviews_container">
                        ${getReviews()}
                    </div>
                </div>
                <div class="main_employees_setcion container_section">
                    <p class="fz16 lh24 w700">${this.translationText()['employeesTitle']}</p>
                    <div class="employees_container_1">
                        ${employeeContainer1()}
                        ${this.employeeContainer2(4)}
                    </div>
                </div>
                <div class="show_more_employees_container">
                    <button class="button_text fz16 lh24 w500">${this.translationText()['employeesMoreBtn']}</button>
                </div>
                <div class="main_about_us_setcion container_section">
                    <p class="fz16 lh24 w700">${this.translationText()['aboutUsTitle']}</p>
                    <div class="main_about_us_container">
                        <div id="main_page_map" class="main_about_map_container"></div>
                        <div class="main_about_adress_section">
                            <div class="main_about_adress_container">
                                ${locationIconSVG}
                                <div class="main_about_adress_text_container">
                                    <p class="about_adress_1 w700">${this.translationText()['aboutUsAdress1']}</p>
                                    <p class="about_adress_2 w500 op05">${this.translationText()['aboutUsAdress2']}</p>
                                </div>
                            </div>
                        </div>
                        <div class="main_about_contacts_section">
                            <div class="main_about_contacts_container">
                                <div class="main_about_email_container">
                                    <p class="fz12 lh16 w500 op05">${this.translationText()['aboutUsEmailLabel']}</p>
                                    <p class="color_3">europeaninvestorfund@gmail.com</p>
                                </div>
                                <div class="main_about_workhours_container">
                                    <p class="fz12 lh16 w500 op05">${this.translationText()['aboutUsWorkingHoursLabel']}</p>
                                    <p class="">${this.translationText()['aboutUsWorkingHoursText']}</p>
                                </div>
                            </div>
                            <div class="main_about_app_store_container">
                                ${appleStoreIconSVG}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return content;
    }

    async runJs() {
        try {
            document.getElementById('main').classList.add('wdth930');
    
            let getExtraEmployeesBtnContainer = document.getElementsByClassName('show_more_employees_container')[0];
            let getExtraEmployeesBtn = document.querySelector('.show_more_employees_container button');
            let employeesContainer = document.getElementsByClassName('employees_container_1')[0];
        
            getExtraEmployeesBtn.addEventListener('click', (event) => {
                let employees = this.employeeContainer2(8);
                
                if (employees.last) {
                    employeesContainer.innerHTML += employees.content;
                    getExtraEmployeesBtnContainer.remove();
                } else {
                    employeesContainer.innerHTML += employees;
                }
            });

            let map = L.map('main_page_map', {
                zoomControl: false,
                attributionControl: false
            }).setView([51.5175311, -0.155639], 18);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

            let customIcon = L.icon({
                iconUrl: '../images/marker-icon.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30],
                className: 'custom-marker'
            });

            L.marker([51.5175311, -0.155639], {icon: customIcon}).addTo(map);

        } catch (error) {
            console.error(error);
        }
    }
}