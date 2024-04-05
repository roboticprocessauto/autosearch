// ==UserScript==
// @name         Company Info Extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extract company info and search on Google
// @author       You
// @match        https://office.ratrading.eu/sage/index.cfm?page_id=830&company_id=*
// @match        https://office.agavasystem.com/sage/index.cfm?page_id=830&company_id=*
// @match        https://office.sovamaxusa.com/sage/index.cfm?page_id=830&company_id=*
// @match        https://office.sovasystem.com/sage/index.cfm?page_id=830&company_id=*
// @match        https://eminiasystem.com/sage/?page_id=830&company_id=*
// @match        https://office.laniustoys.com/sage/index.cfm?page_id=830&company_id=*
// @match        https://office.dbreactor.com/sage/index.cfm?page_id=830&company_id=*
// @match        https://office.atlastradingworld.com/sage/index.cfm?page_id=830&company_id=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function extractAndSearch() {
        try {
            // Извлечение названия компании
            const company_name_element = document.querySelector('#company_name__data');
            let company_name_text = company_name_element ? company_name_element.textContent.trim() : 'N/A';

            // Инициализация переменной для адреса
            let company_address_text = '';

            // Проверка URL, чтобы определить правильный селектор
            if (window.location.href.startsWith('https://eminiasystem.com/sage/')) {
                // Новый селектор для eminiasystem.com
                const address_elements = document.querySelectorAll('#primary_billing_address_data .scr_data');
                company_address_text = Array.from(address_elements).map(el => el.textContent.trim()).join(', ');
            } else {
                // Старый селектор для других сайтов
                const company_address_element = document.querySelector('#primary_billing_address_data');
                company_address_text = company_address_element ? company_address_element.textContent.trim() : 'N/A';
            }

            // Формирование поискового запроса
            let search_query;
            if (!company_address_text || company_address_text.includes("No address available")) {
                search_query = company_name_text;
            } else {
                search_query = `${company_name_text} ${company_address_text}`;
            }

            window.open(`https://www.google.com/search?q=${encodeURIComponent(search_query)}`, '_blank');
        } catch (e) {
            console.error(`Exception when extracting company info: ${e}`);
        }
    }

    function updateCompanyStatus() {
        let select_element = document.getElementById("company_staus_id");
        if (select_element) {
            let event = new Event('change', { bubbles: true });
            select_element.value = "197";
            select_element.dispatchEvent(event);

            let save_button = document.getElementById("update_company_status");
            if (save_button) {
                save_button.click();
            }
        }
    }

    function setNotInSuppliesBusiness() {
        let select_element = document.getElementById("company_staus_id");
        if (select_element) {
            let event = new Event('change', { bubbles: true });
            select_element.value = "254";
            select_element.dispatchEvent(event);

            let save_button = document.getElementById("update_company_status");
            if (save_button) {
                save_button.click();
            }
        }
    }

     // Обработчик нажатия клавиш
    document.addEventListener('keydown', function(e) {
        // Обработка нажатия Alt+D
        if (e.altKey && e.code === 'KeyD') {
            e.preventDefault(); // Предотвращаем стандартные действия для сочетания клавиш
            updateCompanyStatus();
        }
        // Обработка нажатия Alt+Z (предыдущий обработчик)
        if (e.altKey && e.code === 'KeyZ') {
            e.preventDefault(); // Предотвращаем стандартные действия для сочетания клавиш
            extractAndSearch(); // Предполагается, что эта функция уже определена в вашем скрипте
        }
        // Обработка нажатия Alt+S
        if (e.altKey && e.code === 'KeyS') {
            e.preventDefault(); // Предотвращаем стандартные действия для сочетания клавиш
            setNotInSuppliesBusiness();
        }
    });
})();
