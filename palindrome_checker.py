def is_palindrome(text):
    clean_text = "".join(c for c in text if c.isalnum()).lower()
    if clean_text == clean_text[::-1]:
        return True
    else:
        return False

word1 = "level"
word2 = "A man, a plan, a canal: Panama"
word3 = "hello world"

print(f"'{word1}' is a palindrome: {is_palindrome(word1)}")
print(f"'{word2}' is a palindrome: {is_palindrome(word2)}")
print(f"'{word3}' is a palindrome: {is_palindrome(word3)}")