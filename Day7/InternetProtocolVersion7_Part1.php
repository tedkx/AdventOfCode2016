<?php 
define ('SEQUENCE_REGEX', '/\[(.+?)\]/');

class SequenceTaxonomist { 
    public $supernet = array(); 
    public $hypernet  = array(); 
    
    function __construct($input) {
      preg_match_all(SEQUENCE_REGEX, $input,$matches);
      foreach($matches[1] as &$match)
        array_push($this->hypernet, $match);
      
      foreach(explode("|", preg_replace(SEQUENCE_REGEX, '|', $input)) as $match)
        array_push($this->supernet, $match);
    }
} 

function supportsTLS($input) {
	$seq = new SequenceTaxonomist($input);
	foreach($seq->hypernet as &$hyperseq)
		if(isAbba($hyperseq))
			return false;

	foreach($seq->supernet as &$normalseq)
		if(isAbba($normalseq))
			return true;

	return false;
}

function isAbba($input) {
	$offset = 0;
	$len = strlen($input);
	if($len < 4)
		return false;
	while($offset <= $len - 4) {
		$str = substr($input, $offset, 4);
		if($str[0] == $str[3] && $str[0] != $str[1] && 
			$str[1] == $str[2] && $str[2] != $str[3]) 
			return true;
		$offset++;
	}
	return false;
}

$input = explode("\n", file_get_contents('input.txt'));
$total = 0;

foreach ($input as &$value)
	if(supportsTLS($value))
		$total++;

echo "Total TLS Addresses: $total\n\n";
