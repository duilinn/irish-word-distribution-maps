from collections import Counter
import math
import pandas as pd
from bs4 import BeautifulSoup
from urllib.request import urlopen
import urllib
import re
import matplotlib.pyplot as plt
import numpy as np
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import sys

with open("public/decades.csv") as file:
    book_years_old = [line.strip().split(",") for line in file.readlines()]

with open("public/book_years.csv") as file:
    book_years = [line.strip().split(",") for line in file.readlines()]


def download_search_page(word):
    options = Options()
    options.add_argument("start-maximized")
    options.add_argument("disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-search-engine-choice-screen")
    browser = webdriver.Chrome(chrome_options=options, executable_path="public/chromedriver.exe")
    search_type = "S"
    browser.get(f"http://corpas.ria.ie/index.php?fsg_word={urllib.parse.quote_plus(word)}&fsg_class={search_type}&fsg_pos=All&fsg_pp=Both&fsg_years=1600-1926&fsg_function=10&fsg_allfiles=yes")
    browser.implicitly_wait(20)

    nav = browser.find_element(By.ID, "search_results")

    innerHTML = nav.get_attribute("innerHTML")

    return "<html>" + innerHTML + "</html>"

def parse_word_table(word, once_per_book=False):
    table_html = download_search_page(word)
    soup = BeautifulSoup(table_html, 'html.parser')

    occurences_per_year = {}
    for book in soup.find_all("div"):
        try:
            book_title = book.h3.contents[0]
            #print(book_title[-5:-1])
            year = book_title[-5:-1]

            if year.isdigit():
                # print(f"year = {year}")

                if once_per_book:
                    count_in_book = 1
                else:
                    count_in_book = len(book.find_all(class_ = "fng_result"))
                # print(f"count in book = {count_in_book}")

                decade = str(int(int(year)/10) * 10)
                # print(f"decade = {decade}")
                if decade in occurences_per_year:
                    occurences_per_year[decade] += count_in_book
                else:
                    occurences_per_year[decade] = count_in_book
        except:
            pass
            # print("Error")
    return occurences_per_year

def graph_word(word, once_per_book):
    word_counts = parse_word_table(word, once_per_book)

    
    freq_series = []
    for [decade, book_decade_freq] in book_years:
        if int(decade) >= 1580 and int(decade) <= 1920:
            pc = 0
            if int(decade) == 1880:
                pc = 0
            elif decade in word_counts:
                pc = word_counts[decade]/int(book_decade_freq)

            freq_series.append(pc)
            # print(f"{decade},{pc*10000}")
    
    return freq_series
print('["test"]')
# print(graph_word(sys.argv[1], once_per_book=False))