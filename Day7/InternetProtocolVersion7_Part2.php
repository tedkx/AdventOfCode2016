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

function supportsSSL($input) {
	$seq = new SequenceTaxonomist($input);
	foreach($seq->supernet as &$superseq) {
		$abas = getAbas($superseq);
		if(sizeof($abas)) {
			foreach($abas as &$aba)
				foreach($seq->hypernet as &$hyperSeq)
					if(hasBab($hyperSeq, $aba))
						return true;
		}
	}
	return false;
}

function getAbas($sequence) {
	$offset = 0;
	$len = strlen($sequence);
	$abas = array();
	if($len < 3)
		return false;
	while($offset <= $len - 3) {
		$aba = substr($sequence, $offset, 3);
		if($aba[0] == $aba[2] && $aba[0] != $aba[1])
			array_push($abas, $aba);
		$offset++;
	}
	return $abas;
}

function hasBab($sequence, $aba) {
	$len = strlen($sequence);
	if($len < 3)
		return false;
	for($i = 0; $i <= $len - 3; $i++)
		if($sequence[$i] == $aba[1] && $sequence[$i + 1] == $aba[0] && $sequence[$i + 2] == $aba[1])
			return true;
	return false;
}

$input = explode("\n", file_get_contents('input.txt'));
$total = 0;


foreach ($input as &$value)
	if(supportsSSL($value))
		$total++;

#supportsSSL($input[3]);
echo "Total SSL Addresses: $total\n\n";
