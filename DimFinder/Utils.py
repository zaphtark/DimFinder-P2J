#!/usr/bin/env python
# coding: utf-8

# In[131]:


import json
import copy
import re

from unicodedata import normalize

from cltk import NLP
nlp = NLP("grc")


# In[132]:


with open('charDict.json', 'r', encoding='utf-8') as f:
    char_dict = json.load(f)


# ## Load JSON File

# In[113]:


def read_jsonfile(play):
    with open('data/'+play+'.json', 'r', encoding='utf-8') as f:
        play_file = json.load(f)

    return play_file


# ## Get all lines from json

# In[112]:


def get_lines_from_json(play):
    json = read_jsonfile(play)
    all_lines = list()
    for said in json['content']:
        line = {'id':said['id'],'name':said['name'], 'text':[]}
        for verse in said['text']:
            line['text'].append(verse['text'])
        all_lines.append(line)
    return all_lines


# ## Clean (and lemmatize?) text

# In[40]:


def clean_texts(list_of_texts, lemma, detailed, diacritics):
    purge_char = [",", ".", ";", ":", "—", "†"]
    if lemma is False: 
        purge_char.append("'")

    clean_texts = list()
    for text in list_of_texts:
        ##Basic preprocessing
        clean_text = text[:]
        clean_text = clean_text.replace("\n", " ")
        for char in purge_char:
            clean_text = clean_text.replace(char, "")
        
        ##Lemmatization
        if lemma is True:
            cltk_doc = nlp.analyze(clean_text)
            clean_text = " ".join([word.lemma for word in cltk_doc.words]) 
        
        #Give every info about word
        if detailed is True:
            cltk_doc = nlp.analyze(clean_text)
            clean_text = [clean_word(word) for word in cltk_doc.words] 
        
        ##Diacritics removal
        if diacritics is False and detailed is False:
            clean_text = normalize("NFKD", clean_text).translate({ord(c): None for c in "̓̔́̀͂̈ͅ"})
            
        clean_texts.append(clean_text)
    return clean_texts


# In[127]:


def clean_lines(list_of_lines, lemma=False, detailed=False, diacritics=True):
    clean_lines = list()
    for line in list_of_lines:
        clean_text = clean_texts(line['text'], lemma, detailed, diacritics)
        clean_line = copy.deepcopy(line)
        clean_line['text'] = clean_text
        clean_lines.append(clean_line)
    return clean_lines


# In[109]:


def clean_word(word):
    clean_word = dict()
    word_object = vars(word)
    for key in word_object.keys():
        if word_object[key] is not None:
            clean_word[key] = word_object[key]
    return clean_word


# ## Find diminutives with Regex

# In[122]:


def find_matches(regex, lines):
    matches = list()
    for line in lines:
        for text in line['text']:
            match = re.search(regex, text)
            if match is not None:
                matches.append({'matches':match, 'line':line})
    return matches      


# ## Get lines by character

# In[106]:


def get_lines_by_character(character, play):
    char_lines = list()
    for line in play:
        if line["name"] == character:
            char_lines.append(line)
    return char_lines


# In[105]:


def get_lines_all_characters(play):
    all_char_lines = dict()
    for line in play:
        if line['name'] in all_char_lines.keys():
            all_char_lines[line['name']].append(line)
        else:
            all_char_lines[line['name']] = [line]
    return all_char_lines


# ## Generate character and gender list

# In[104]:


def get_play_characters(play):
    text_by_char = get_lines_all_characters(play)
    return text_by_char.keys()


# In[121]:


def get_play_characters_gender(play):
    characters = get_play_characters(play)
    men, women, unsure = list(), list(), list()
    for character in characters:
        try:
            gender = str(nlp.analyze(character).words[0].features["Gender"])
        except: 
            print("Problem with " + character)
        else:
            if gender == '[masculine]':
                men.append(character)
            elif gender == '[feminine]':
                women.append(character)
            else:
                unsure.append(character)
    return {'men':men,'women':women,'unsure':unsure}


# ## Get lines by gender

# In[124]:


def get_lines_by_gender(play):
    all_lines = {'men':[],'women':[]}
    for line in play:
        if get_character_gender(play,line['name']) == 'woman':
            all_lines['women'].append(line)
        
        if get_character_gender(play,line['name']) == 'man':
            all_lines['men'].append(line)
    return all_lines


# ## Get a character's gender

# In[126]:


def get_character_gender(play,character):
    if character in char_dict[play]["men"]:
        return "man"
    if character in char_dict[play]["women"]:
        return "woman"
    else:
        return "unsure"

