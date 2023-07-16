import sys
import json
import re

class Loca:
    """A simple class to handle STFC loca JSON files"""
    suffixRe = re.compile(r'_[0-9]+$')

    def __init__(self, file, trimPrefix = None, trimSuffix = True):
        self.data = {}
        self.keys = {}
        prefixLen = 0 if trimPrefix is None else len(trimPrefix) + 1
        for loca in json.load(file):
            loca['id'] = str(loca['id'])
            if not loca['id'] in self.data:
                self.data[loca['id']] = {}

            # Check for key prefix
            if trimPrefix is not None and loca['key'].startswith(trimPrefix):
                loca['key'] = loca['key'][prefixLen:]

            # Check for numeric suffix
            if trimSuffix:
                loca['key'] = Loca.suffixRe.sub('', loca['key'])

            # Convert to camelCase
            loca['key'] = Loca.snakeToCamel(loca['key'])

            self.data[loca['id']][loca['key']] = loca['text']
            self.keys[loca['key']] = True

    snakeToCamelRe = re.compile(r'_([a-z])')

    def snakeToCamel(string):
        return Loca.snakeToCamelRe.sub(Loca.capitalize, string)

    def capitalize(matchobj):
        return matchobj.group(1).capitalize()

def load(file, trimPrefix = None, trimSuffix = True):
    return Loca(file, trimPrefix, trimSuffix)

